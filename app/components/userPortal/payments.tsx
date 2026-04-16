"use client"

import { useState, useEffect } from "react"
import {
  Zap,
  Droplets,
  Wifi,
  Phone,
  Tv,
  Shield,
  ChevronRight,
  Search,
  Calendar,
  Building2,
  CreditCard,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { processPaybill, getPaybillHistory, type PaybillRequest, type PaybillHistoryItem, useAuthRedirect, type CategorizedAccounts } from "~/api/auth"
import { toast } from "sonner" 
import { Link } from "react-router"

const billCategories = [
  { name: "Electricity", icon: Zap, color: "text-yellow-500", pending: 1, paybill: "888880" },
  { name: "Water", icon: Droplets, color: "text-blue-500", pending: 0, paybill: "444444" },
  { name: "Internet", icon: Wifi, color: "text-purple-500", pending: 1, paybill: "320320" },
  { name: "Phone", icon: Phone, color: "text-green-500", pending: 0, paybill: "150150" },
  { name: "TV/Cable", icon: Tv, color: "text-red-500", pending: 0, paybill: "444777" },
  { name: "Insurance", icon: Shield, color: "text-indigo-500", pending: 1, paybill: "200222" },
]

const scheduledPayments = [
  { name: "Netflix Subscription", amount: 2315.99, date: "Mar 15, 2026", status: "upcoming" },
]

export default function PaymentsPage() {
  // Modal & Loading State
  const [selectedCategory, setSelectedCategory] = useState<typeof billCategories[0] | null>(null)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // History State
  const [history, setHistory] = useState<PaybillHistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  // Form Input States
  const [accountReference, setAccountReference] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [currentAccount, setCurrentAccount] = useState<CategorizedAccounts | null>(null);
  const customer = useAuthRedirect()

  // Fetch history on mount
  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const response = await getPaybillHistory()
      if (response.success) {
        setHistory(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch history")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Helper to find category details for the history list
  const getCategoryByPaybill = (paybill: string) => {
    return billCategories.find(c => c.paybill === paybill)
  }

  const handleCategoryClick = (category: typeof billCategories[0]) => {
    setSelectedCategory(category)
    setAccountReference("")
    setAmount("")
    setDescription("")
    setIsPayModalOpen(true)
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    setIsSubmitting(true)

    const payload: PaybillRequest = {
      businessNumber: selectedCategory.paybill,
      accountReference: accountReference,
      amount: parseFloat(amount),
      description: description || `Payment for ${selectedCategory.name}`,
    }

    try {
      const response = await processPaybill(payload)
      
      if (response.success) {
        toast.success(`Payment Successful! Ref: ${response.data.referenceCode}`)
        setIsPayModalOpen(false)
        fetchHistory() // Refresh the history list immediately
      }
    } catch (error: any) {
      toast.error(error.message || "Payment failed. Please check your balance.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
        <p className="text-muted-foreground">
          Pay bills and manage your scheduled payments.
        </p>
      </div>

      {/* Bill Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Pay Bills</CardTitle>
          <CardDescription>Select a category to pay your bills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {billCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                className="relative flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-secondary active:scale-95"
              >
                {category.pending > 0 && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {category.pending}
                  </span>
                )}
                <category.icon className={`h-6 w-6 ${category.color}`} />
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCategory && <selectedCategory.icon className={`h-5 w-5 ${selectedCategory.color}`} />}
              Pay {selectedCategory?.name} Bill
            </DialogTitle>
            <DialogDescription>
              Enter your account details below to process the payment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayment} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="paybill">Business Number (Paybill)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="paybill" 
                  value={selectedCategory?.paybill || ""} 
                  readOnly 
                  className="pl-9 bg-muted/50 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account Reference (e.g. Meter No)</Label>
              <Input 
                id="account" 
                placeholder="Enter account number" 
                value={accountReference}
                onChange={(e) => setAccountReference(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Ksh)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold text-muted-foreground">Ksh</span>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-12" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 p-3 flex items-center justify-between border border-primary/10">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Source: Wallet Balance</span>
              </div>
              <span className="text-xs font-bold">Ksh {
                customer?.accounts?.current?.[0]?.balance?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? "0.00"
              }</span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scheduled Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Payments</CardTitle>
            <Button variant="ghost" size="sm">
              <Calendar className="mr-2 h-4 w-4" /> View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledPayments.map((payment, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{payment.name}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">Ksh {payment.amount.toFixed(2)}</p>
                  <Badge variant="secondary" className="text-[10px] capitalize">{payment.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Payments - CONNECTED TO API */}
        <Card className="flex flex-col h-fit"> {/* Changed to h-fit since we only show 3 */}
          <CardHeader className="flex flex-row items-center justify-between shrink-0">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Payments
              </CardTitle>
            </div>
            <Link className="flex"
            to="/customerPortal/transactions">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          
          <CardContent className="space-y-3"> 
            {isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading history...</p>
              </div>
            ) : history.length === 0 ? (
              <p className="text-center py-6 text-xs text-muted-foreground">No recent payments found.</p>
            ) : (
              /* .slice(0, 3) ensures only the first 3 items are rendered */
              history.slice(0, 3).map((payment) => {
                const category = getCategoryByPaybill(payment.business_number);
                return (
                  <div
                    key={payment.reference_code}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-secondary/50 border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        {category ? (
                          <category.icon className={`h-5 w-5 ${category.color}`} />
                        ) : (
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {category?.name || `Paybill ${payment.business_number}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">Ksh {parseFloat(payment.amount).toLocaleString()}</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] hover:bg-green-100 capitalize">
                        paid
                      </Badge>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Pay */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Pay</CardTitle>
          <CardDescription>Search for a biller and pay instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search billers..." className="pl-9" />
            </div>
            <Button>Pay Now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}