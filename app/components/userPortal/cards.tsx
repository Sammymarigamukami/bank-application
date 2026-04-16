"use client"

import { useEffect, useState } from "react"
import { Snowflake, Eye, Lock, Trash2, Plus, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { toast } from "sonner"
// Import Dialog components for the modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

import { 
  getAllCustomerCards, 
  issueNewCard, 
  freezeCard, 
  unfreezeCard, 
  deleteCard, 
  useAuthRedirect
} from "~/api/auth"

export default function CardsPage() {
  const customer = useAuthRedirect()
  console.log("Authenticated customer card page", customer)
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<any | null>(null)

  // --- 1. Security: Masking Functions ---
  const maskCardNumber = (num: string) => {
    if (!num) return "**** **** **** ****"
    // Shows only the last 4 digits
    return `**** **** **** ${num.slice(-4)}`
  }

  const maskText = (text: string) => {
    if (!text) return "****"
    // Shows first character and masks the rest
    return `${text[0]}*** ***`
  }

  const maskExpiry = () => "**/**"

  // --- 2. Load All Customer Cards ---
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      const result = await getAllCustomerCards()
      if (result?.success) {
        setCards(result.data)
      } else {
        toast.error("Failed to load your cards")
      }
      setLoading(false)
    }
    fetchCards()
  }, [])

  // --- 3. Handle Add New Card ---
  const handleAddNewCard = async () => {
    const result = await issueNewCard({ card_type: 'debit' })
    if (result?.success) {
      setCards((prev) => [...prev, result.data])
      toast.success("New card issued successfully")
    } else {
      toast.error("Failed to issue new card")
    }
  }

  // --- 4. Handle Freeze/Unfreeze Toggle ---
  const handleToggleStatus = async (cardId: string, currentStatus: string) => {
    setProcessingId(cardId)
    const isFrozen = currentStatus === "blocked" || currentStatus === "frozen"
    const result = isFrozen ? await unfreezeCard(cardId) : await freezeCard(cardId)

    if (result?.success) {
      toast.success(result.message)
      setCards((prev) => prev.map(c => 
        c.card_id.toString() === cardId ? { ...c, status: result.status } : c
      ))
    }
    setProcessingId(null)
  }

  // --- 5. Handle Delete Card ---
  const handleDeleteCard = async (cardId: string) => {
    const confirmDelete = window.confirm("Permanently delete this card?")
    if (!confirmDelete) return

    setProcessingId(cardId)
    const result = await deleteCard(cardId)
    if (result?.success) {
      toast.success(result.message)
      setCards((prev) => prev.filter(c => c.card_id.toString() !== cardId))
    }
    setProcessingId(null)
  }

  // --- 6. Handle Details (Open Modal) ---
  const handleViewDetails = (card: any) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Cards</h1>
          <p className="text-muted-foreground text-sm">Manage your secure payment methods.</p>
        </div>
        <Button onClick={handleAddNewCard}>
          <Plus className="mr-2 h-4 w-4" /> Add New Card
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => {
          const isBlocked = card.status === "blocked" || card.status === "frozen"
          return (
            <Card key={card.card_id} className="overflow-hidden shadow-sm">
              <CardContent className="p-6">
                {/* MASKED CARD DESIGN */}
                <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br p-5 text-white transition-all duration-300 ${isBlocked ? "from-slate-600 to-slate-900 grayscale" : "from-primary via-primary to-accent"}`}>
                  <div className="relative space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium opacity-80">NexusBank</span>
                      <Badge variant="secondary" className="bg-white/20 text-white border-none">{card.status}</Badge>
                    </div>
                    
                    {/* Hashed Number */}
                    <div className="font-mono text-lg tracking-widest">
                      {maskCardNumber(card.card_number)}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase opacity-60">Card Holder</p>
                        <p className="text-sm font-medium">{maskText(customer.username)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase opacity-60">Expires</p>
                        <p className="text-sm font-medium">{maskExpiry()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="flex-col h-auto py-3" onClick={() => handleToggleStatus(card.card_id.toString(), card.status)} disabled={!!processingId}>
                    <Snowflake className={`h-4 w-4 mb-1 ${isBlocked ? "text-blue-400" : ""}`} />
                    <span className="text-[10px]">{isBlocked ? "Unfreeze" : "Freeze"}</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex-col h-auto py-3" onClick={() => handleViewDetails(card)}>
                    <Eye className="h-4 w-4 mb-1" />
                    <span className="text-[10px]">Details</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex-col h-auto py-3 text-red-500 hover:bg-red-50" onClick={() => handleDeleteCard(card.card_id.toString())} disabled={!!processingId}>
                    {processingId === card.card_id.toString() ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mb-1" />}
                    <span className="text-[10px]">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* --- TRUE DATA MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Sensitive Card Details</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4 py-4">
              <div className="rounded-xl bg-slate-900 p-6 text-white font-mono shadow-xl">
                <p className="text-[10px] uppercase opacity-50 mb-4 tracking-tighter">Official Card Record</p>
                
                {/* TRUE Card Number formatted in groups of 4 */}
                <div className="text-xl tracking-widest mb-6">
                  {selectedCard.card_number.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ')}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] opacity-40 uppercase">Card Holder</p>
                    <p className="text-sm">{customer.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] opacity-40 uppercase">Expiry Date</p>
                    <p className="text-sm">{selectedCard.expiry_date?.split('T')[0]}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs text-amber-800 leading-tight">
                  <strong>Warning:</strong> You are viewing unmasked sensitive data. Ensure no one is looking at your screen.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Card Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Cashback", value: "0%", description: "On all purchases" },
              { title: "Points Earned", value: "0", description: "This month" },
              { title: "Travel Insurance", value: "Included", description: "Up to Ksh500K" },
              { title: "ATM Withdrawals", value: "Free", description: "Worldwide" },
            ].map((benefit, i) => (
              <div key={i} className="rounded-lg bg-secondary/50 p-4">
                <p className="text-2xl font-bold text-foreground">{benefit.value}</p>
                <p className="text-sm font-medium">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}