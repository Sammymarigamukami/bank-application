'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { 
  initiateDeposit, 
  getMpesaStatus 
} from '~/api/auth';
import { useDeposit } from '../context/depositContext';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';
import { Card } from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { useAuthRedirect } from '~/api/auth';

const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'MPesa', enabled: true, icon: Smartphone }
];

export function DepositUI() {
  const customer = useAuthRedirect();
  const {
    showDepositModal, setShowDepositModal,
    showMpesaProcessing, setShowMpesaProcessing,
    amount, setAmount,
    transactionStatus, setTransactionStatus,
  } = useDeposit();

  // Local UI State
  const [phone, setPhone] = useState('0715907311');
  const [selectedMethod, setSelectedMethod] = useState('mpesa');
  const [error, setError] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pollingCount = useRef(0);

  // --- POLLING LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollStatus = async () => {
      if (!checkoutRequestId || transactionStatus !== 'pending') return;

      try {
        const response = await getMpesaStatus(checkoutRequestId);
        
        // Match these with your backend status strings
        if (response.status === 'COMPLETED' || response.status === 'SUCCESS') {
          setTransactionStatus('success');
        } else if (response.status === 'FAILED' || response.status === 'CANCELLED') {
          setTransactionStatus('failed');
          setError(response.message || 'Transaction was declined.');
        }

        pollingCount.current += 1;
        if (pollingCount.current > 30) { // 90 seconds timeout
          setTransactionStatus('failed');
          setError('Request timed out. Please try again.');
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    if (transactionStatus === 'pending' && checkoutRequestId) {
      interval = setInterval(pollStatus, 3000);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [transactionStatus, checkoutRequestId, setTransactionStatus]);

  // --- HANDLERS ---
  const handleStartDeposit = async () => {
    // Validation
    if (!customer?.accountId) {
      setError('System error: Your account information could not be verified.');
      return;
    }
    if (!amount || Number(amount) < 1) {
      setError('Please enter an amount of at least 1 KES');
      return;
    }
    if (!phone.match(/^(?:254|\+254|0)?(7|1)\d{8}$/)) {
      setError('Please enter a valid Safaricom number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await initiateDeposit({
        phone: phone,
        amount: amount,
        accountId: customer.accountId
      });

      if (result?.CheckoutRequestID) {
        setCheckoutRequestId(result.CheckoutRequestID);
        pollingCount.current = 0;
        setShowDepositModal(false);
        setShowMpesaProcessing(true);
        setTransactionStatus('pending');
      } else {
        setError(result?.message || 'Failed to trigger M-Pesa push.');
      }
    } catch (err) {
      setError('Connection failed. Check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAll = () => {
    setShowDepositModal(false);
    setShowMpesaProcessing(false);
    setTransactionStatus('idle');
    setCheckoutRequestId('');
    setAmount('');
    setError('');
    pollingCount.current = 0;
  };

  return (
    <>
      {/* 1. INPUT MODAL */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Deposit Funds</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to top up your account.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-3">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">Amount (KES)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-medium">KES</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-12 text-lg font-semibold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">M-Pesa Number</Label>
              <Input
                id="phone"
                placeholder="07xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Payment Method</Label>
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="grid grid-cols-1 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="relative">
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      disabled={!method.enabled}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={method.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${method.enabled ? 'hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5' : 'opacity-50 cursor-not-allowed bg-slate-50'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <method.icon className="w-5 h-5 text-slate-500" />
                        <span className="font-medium">{method.name}</span>
                      </div>
                      {!method.enabled && <span className="text-[10px] uppercase bg-slate-200 px-2 py-1 rounded">Soon</span>}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg animate-in fade-in zoom-in-95">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDepositModal(false)}>Cancel</Button>
            <Button 
              className="px-8 bg-green-600 hover:bg-green-700" 
              onClick={handleStartDeposit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. PROCESSING MODAL */}
      <Dialog open={showMpesaProcessing} onOpenChange={setShowMpesaProcessing}>
        <DialogContent className="sm:max-w-[400px] py-12">
          <div className="flex flex-col items-center text-center space-y-6">
            
            {transactionStatus === 'pending' && (
              <>
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-green-600" />
                  <Smartphone className="absolute inset-0 m-auto w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Check your phone</h3>
                  <p className="text-slate-500 max-w-[280px]">
                    We've sent an M-Pesa STK push to <span className="font-bold">{phone}</span>. Please enter your PIN to complete.
                  </p>
                </div>
              </>
            )}

            {transactionStatus === 'success' && (
              <>
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Success!</h3>
                  <p className="text-slate-500">KES {amount} has been added to your account.</p>
                </div>
                <Button className="w-full" onClick={resetAll}>Done</Button>
              </>
            )}

            {transactionStatus === 'failed' && (
              <>
                <div className="p-4 bg-red-100 rounded-full">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Payment Failed</h3>
                  <p className="text-slate-500">{error || "Something went wrong."}</p>
                </div>
                <Button className="w-full" variant="outline" onClick={resetAll}>Try Again</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}