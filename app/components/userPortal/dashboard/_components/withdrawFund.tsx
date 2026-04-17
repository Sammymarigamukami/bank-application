'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Field, FieldLabel } from '~/components/ui/field';
import { ProcessingModal } from './processing-modal';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useAuthRedirect } from '~/api/auth';
import { useWithdrawal } from '../context/withdrawalContext';

export function WithdrawalForm() {
  const {
    showWithdrawModal,
    setShowWithdrawModal,
    showProcessingModal,
    transactionStatus,
    errorMessage,
    startWithdrawal,
    closeAllModals,
  } = useWithdrawal();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const customer = useAuthRedirect();

  const validateForm = () => {
    const newErrors: { amount?: string } = {};
    const balance = customer?.accounts?.current?.[0]?.balance ?? 0;

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Enter a valid amount';
    } else if (Number(amount) > balance) {
      newErrors.amount = 'Insufficient balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdraw = () => {
    if (!validateForm()) return;

    startWithdrawal({
      amount,
      description: description || "Funds Withdrawal",
    });
  };

  const resetAndClose = () => {
    setAmount('');
    setDescription('');
    setErrors({});
    setShowWithdrawModal(false);
  };

  return (
    <>
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="sm:max-w-[400px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Transfer money from your wallet to your linked bank account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-primary/5 p-3 flex items-center justify-between border border-primary/10">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Available Balance</span>
              </div>
              <span className="text-xs font-bold">Ksh {
                customer?.accounts?.current?.[0]?.balance?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                }) ?? "0.00"
              }</span>
            </div>

            <Field>
              <FieldLabel htmlFor="amount">Amount to Withdraw (KES)</FieldLabel>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors({});
                }}
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
              <Input
                id="description"
                placeholder="e.g. Rent, Savings"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetAndClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleWithdraw} className="flex-1">
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProcessingModal
        isOpen={showProcessingModal}
        onClose={closeAllModals}
        status={transactionStatus}
        title="Withdrawal Transaction"
        description="Your withdrawal is being processed."
        amount={amount}
        onCancelTransaction={closeAllModals}
      />
    </>
  );
}