'use client';

import { useState, useMemo } from 'react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useAuthRedirect } from '~/api/auth';

const DURATIONS = [
  { id: '3m', label: '3 Months', rate: 7.0, months: 3 },
  { id: '6m', label: '6 Months', rate: 8.5, months: 6 },
  { id: '12m', label: '12 Months', rate: 11.0, months: 12 },
];

interface FDFormProps {
  onSubmit: (data: {
    account: string;
    amount: number;
    duration: string;
    rate: number;
    maturityDate: Date;
    payout: number;
  }) => Promise<void>;
}

export function FDForm({ onSubmit }: FDFormProps) {
  // 1. Destructure the user from the auth hook
  const user = useAuthRedirect();
  
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Safely extract the current account ID (Customer 31: Account 14)
  const currentAccount = user?.accounts?.current?.[0];
  const sourceAccountId = currentAccount?.id.toString() || '';
  const currentBalance = currentAccount?.balance || 0;

  const selectedDuration = DURATIONS.find((d) => d.id === duration);
  
  const calculations = useMemo(() => {
    if (!amount || !selectedDuration) return { maturityDate: null, payout: 0 };
    const principal = parseFloat(amount);
    const interest = (principal * selectedDuration.rate * selectedDuration.months) / (100 * 12);
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + selectedDuration.months);
    return { maturityDate, payout: principal + interest };
  }, [amount, duration, selectedDuration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceAccountId || !amount || !selectedDuration || !calculations.maturityDate) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        account: sourceAccountId,
        amount: parseFloat(amount),
        duration: duration,
        rate: selectedDuration.rate,
        maturityDate: calculations.maturityDate,
        payout: calculations.payout
      });
      setAmount('');
      setDuration('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 sticky top-6 border-primary/10 shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-6 text-foreground">Open New Fixed Deposit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-xs font-bold uppercase text-muted-foreground">Source Account</Label>
          <div className="mt-2 space-y-1">
            <Input 
              value={currentAccount ? `Acc: ${currentAccount.number} (Current)` : "Loading account..."} 
              disabled 
              className="bg-muted font-medium" 
            />
            <p className="text-[10px] text-primary font-medium px-1">
              Available Balance: KES {currentBalance.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="amount" className="text-xs font-bold uppercase text-muted-foreground">
            Investment Amount (KES)
          </Label>
          <Input 
            id="amount"
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Min KES 5,000"
            className="mt-2"
            max={currentBalance} // Prevent investing more than the balance
            required
          />
        </div>

        <div>
          <Label className="text-xs font-bold uppercase text-muted-foreground">Investment Term</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.label} @ {d.rate}% p.a.</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {calculations.maturityDate && (
          <div className="bg-primary/5 p-4 rounded-xl space-y-2 border border-primary/10 animate-in fade-in slide-in-from-top-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Maturity Date:</span>
              <span className="font-bold text-foreground">
                {calculations.maturityDate.toLocaleDateString('en-KE', { 
                  day: 'numeric', month: 'short', year: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Estimated Payout:</span>
              <span className="font-bold text-primary">
                KES {calculations.payout.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        )}

        <Button 
          disabled={isSubmitting || !amount || !duration || parseFloat(amount) > currentBalance} 
          className="w-full shadow-lg shadow-primary/20"
        >
          {isSubmitting ? "Processing Transaction..." : "Confirm & Open Deposit"}
        </Button>
      </form>
    </Card>
  );
}