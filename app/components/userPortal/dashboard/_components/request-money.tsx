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
import { useRequestMoney } from '../context/requestContext';
import { CreditCard } from 'lucide-react';
import { useAuthRedirect } from '~/api/auth';

export function RequestMoney() {
  const {
    showRequestFormModal,
    setShowRequestFormModal,
    showProcessingModal,
    transactionStatus,
    startTransaction,
    cancelTransaction,
  } = useRequestMoney();

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const customer = useAuthRedirect();


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- ACTIONS ----------------
  const handleRequestMoney = () => {
    if (!validateForm()) return;

    console.log(
      `Request Money initiated: ${amount} from ${accountNumber}${
        note ? ` with note: ${note}` : ''
      }`
    );

    startTransaction({
      accountNumber,
      amount,
      note,
    });
  };

  const resetForm = () => {
    setAccountNumber('');
    setAmount('');
    setNote('');
    setErrors({});
  };

  const handleCancelTransaction = () => {
    cancelTransaction();
    resetForm();
  };

  const handleCloseModal = () => {
    cancelTransaction();
    resetForm();
  };

  const handleCancelForm = () => {
    setShowRequestFormModal(false);
    resetForm();
  };

  return (
    <>
      {/* ---------------- FORM MODAL ---------------- */}
      <Dialog open={showRequestFormModal} onOpenChange={setShowRequestFormModal}>
        <DialogContent className="sm:max-w-[400px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Request Money</DialogTitle>
            <DialogDescription>
              Enter the account number and amount you want to request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel htmlFor="account-number">Account Number</FieldLabel>
              <Input
                id="account-number"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  if (errors.accountNumber) {
                    setErrors({ ...errors, accountNumber: '' });
                  }
                }}
                className={errors.accountNumber ? 'border-red-500' : ''}
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.accountNumber}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="amount">Amount (KES)</FieldLabel>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) {
                    setErrors({ ...errors, amount: '' });
                  }
                }}
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.amount}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="note">Note (Optional)</FieldLabel>
              <Input
                id="note"
                placeholder="Add a note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Field>
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

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelForm}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleRequestMoney} className="flex-1">
              Request Money
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- PROCESSING MODAL ---------------- */}
      <ProcessingModal
        isOpen={showProcessingModal}
        onClose={handleCloseModal}
        status={transactionStatus}
        title="Request Money Transaction"
        description="Your request is being processed. Please wait for confirmation."
        amount={amount}
        accountNumber={accountNumber}
        onCancelTransaction={handleCancelTransaction}
      />
    </>
  );
}