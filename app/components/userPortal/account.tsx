'use client';

import { useEffect, useState, useMemo } from "react";
import { 
  Wallet, PiggyBank, Building2, Loader2, Search, 
  ArrowUpRight, ShieldCheck, RefreshCcw, SendHorizontal,
  CreditCard
} from "lucide-react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter 
} from "~/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "~/components/ui/select";
import { 
  getAllCategorizedAccounts, 
  useAuthRedirect, 
  processTransfer 
} from "~/api/auth"; 
import { toast } from "sonner";
import { Link } from "react-router";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  current: Wallet,
  savings: PiggyBank,
  business: Building2,
};

export default function ActiveAccountsPage() {
  const customer = useAuthRedirect();
  
  const [categorizedData, setCategorizedData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sourceAccount, setSourceAccount] = useState<any>(null);
  const [targetAccountId, setTargetAccountId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const fetchAllActive = async () => {
    if (!customer?.id) return;
    try {
      setDataLoading(true);
      const result = await getAllCategorizedAccounts(customer.id);
      // Data is nested in .accounts based on your JSON structure
      setCategorizedData(result?.accounts || {});
    } catch (err) {
      toast.error("Failed to load active accounts");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => { fetchAllActive(); }, [customer?.id]);

  const allAccountsList = useMemo(() => {
    if (!categorizedData) return [];
    return Object.values(categorizedData).flat() as any[];
  }, [categorizedData]);

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceAccount?.id || !targetAccountId || !transferAmount) return;

    setIsSubmitting(true);
    try {
      const result = await processTransfer({
        fromAccountId: sourceAccount.id, // Using account ID
        toAccountId: parseInt(targetAccountId), // Using account ID
        amount: parseFloat(transferAmount)
      });
      
      if (result.success) {
        toast.success(`Transfer Successful!`);
        setIsTransferModalOpen(false);
        setTransferAmount("");
        setTargetAccountId("");
        fetchAllActive(); 
      }
    } catch (error: any) {
      toast.error("Internal transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dataLoading && !categorizedData) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary/60" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 max-w-7xl">
      <div className="space-y-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-[10px] uppercase font-bold">
          Banking Dashboard
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">Active Accounts</h1>
      </div>

      <div className="grid gap-12">
        {categorizedData && Object.entries(categorizedData).map(([type, accounts]: [string, any]) => {
          if (!Array.isArray(accounts) || accounts.length === 0) return null;
          const Icon = iconMap[type] || Wallet;

          return (
            <section key={type} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold capitalize">{type}</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {accounts.map((account: any) => (
                  <Card key={account.id} className="relative flex flex-row items-center p-5 pl-7 border-none shadow-sm ring-1 ring-border bg-card overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                    
                    <div className="flex flex-1 flex-row items-center gap-6">
                      <div className="flex-1 space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Account Number</p>
                        <p className="text-xl font-mono font-bold">{account.number}</p>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] h-5 font-bold">
                          {account.status?.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="text-right px-6 hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Available Balance</p>
                        <p className="text-2xl font-black">
                          <span className="text-sm font-medium mr-1">{account.currency}</span>
                          {Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <Button 
                          size="icon" variant="secondary" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => {
                            setSourceAccount(account);
                            setIsTransferModalOpen(true);
                          }}
                        >
                          <SendHorizontal className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl border border-transparent hover:border-border">
                          {/* Navigation uses account.id */}
                          <Link to={`/customerPortal/accounts/${account.id}`}>
                             <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* --- TRANSFER MODAL --- */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-xl">
              <RefreshCcw className="h-5 w-5 text-primary" /> Internal Transfer
            </DialogTitle>
            <DialogDescription>Authorize an instant transfer between accounts.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTransferSubmit} className="space-y-6 py-4">
            <div className="bg-secondary/30 p-4 rounded-2xl border-l-4 border-primary">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">From Account (Source)</Label>
              <div className="flex justify-between items-center mt-1">
                <span className="font-mono font-bold">{sourceAccount?.number}</span>
                <span className="font-bold text-primary">{sourceAccount?.currency} {Number(sourceAccount?.balance).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">To Account (Destination)</Label>
              <Select onValueChange={setTargetAccountId} value={targetAccountId}>
                <SelectTrigger className="h-12 rounded-xl border-2">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {allAccountsList
                    .filter(acc => acc.id !== sourceAccount?.id) // Filtering by ID
                    .map(acc => (
                      <SelectItem key={acc.id} value={acc.id.toString()}>
                        {acc.number} ({acc.type.toUpperCase()})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Transfer Amount</Label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="number" 
                  className="h-12 rounded-xl font-bold pl-10 border-2"
                  placeholder="0.00"
                  value={transferAmount} 
                  onChange={(e) => setTransferAmount(e.target.value)} 
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl font-bold text-lg" disabled={isSubmitting || !targetAccountId}>
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Authorize Transfer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}