'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Snowflake, Eye, Loader2, Plus, CreditCard } from "lucide-react"
import { useAuthRedirect, getAllCustomerCards } from "~/api/auth"
import { toast } from "sonner"
import { Link } from "react-router"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"

export function CardPreview() {
  const customer = useAuthRedirect();
  
  const [firstCard, setFirstCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!customer?.id) return;

    const fetchFirstCard = async () => {
      try {
        setLoading(true);
        const result = await getAllCustomerCards();
        if (result?.success && result.data.length > 0) {
          setFirstCard(result.data[0]);
        } else {
          setFirstCard(null);
        }
      } catch (err) {
        console.error("Preview fetch error", err);
        toast.error("Failed to load card information");
      } finally {
        setLoading(false);
      }
    };

    fetchFirstCard();
  }, [customer?.id]);

  if (loading && !firstCard) {
    return (
      <Card className="h-[280px] flex items-center justify-center border-dashed">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Syncing card...</p>
        </div>
      </Card>
    );
  }

  if (!firstCard) {
    return (
      <Card className="h-[280px] flex flex-col justify-center border-dashed bg-muted/10">
        <CardContent className="flex flex-col items-center text-center py-6">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold mb-1">No Active Cards</h3>
          <p className="text-xs text-muted-foreground mb-6 max-w-[200px]">
            Ready to start spending? Issue your first virtual card in seconds.
          </p>
          <Button asChild size="sm" className="px-8 shadow-sm">
            <Link to="/customerPortal/cards">
              <Plus className="mr-2 h-4 w-4" /> Get a Card
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isBlocked = firstCard.status === "blocked" || firstCard.status === "frozen";

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-tight">Your Primary Card</CardTitle>
          <Link to="/customerPortal/cards" className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        {/* CARD UI */}
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br p-5 text-white transition-all duration-300 ${isBlocked ? "from-slate-600 to-slate-900 grayscale" : "from-primary via-primary to-accent"}`}>
          <div className="relative z-10 space-y-10">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-70 italic">NexusBank</p>
                <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-200/40 to-amber-500/20 border border-white/10" />
              </div>
              <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border backdrop-blur-md
                ${isBlocked ? "bg-red-500/20 border-red-500/30 text-red-200" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-200"}`}>
                {firstCard.status}
              </span>
            </div>
            
            <div className="font-mono text-xl tracking-[0.25em]">
              •••• •••• •••• {firstCard.card_number?.slice(-4)}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Card Holder</p>
                <p className="text-sm font-bold uppercase tracking-wide">
                  {customer?.username || "Nexus User"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Expires</p>
                <p className="text-sm font-bold">**/**</p>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="flex-1 font-semibold" asChild>
            <Link to="/customerPortal/cards">
              <Snowflake className="mr-2 h-3.5 w-3.5" /> Manage
            </Link>
          </Button>
          
          {/* TRIGGER MODAL BUTTON */}
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 font-semibold" 
            onClick={() => setIsModalOpen(true)}
          >
            <Eye className="mr-2 h-3.5 w-3.5" /> Details
          </Button>
        </div>

        {/* SENSITIVE DATA MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Sensitive Card Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="rounded-xl bg-slate-900 p-6 text-white font-mono shadow-xl">
                <p className="text-[10px] uppercase opacity-50 mb-4 tracking-tighter">Official Card Record</p>
                
                <div className="text-xl tracking-widest mb-6">
                  {firstCard.card_number.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ')}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] opacity-40 uppercase">Card Holder</p>
                    <p className="text-sm uppercase">{customer?.username || "Nexus User"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] opacity-40 uppercase">Expiry Date</p>
                    <p className="text-sm">{firstCard.expiry_date?.split('T')[0] || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs text-amber-800 leading-tight">
                  <strong>Warning:</strong> You are viewing unmasked sensitive data. Ensure no one is looking at your screen.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}