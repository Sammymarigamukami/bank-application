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
import { useSendMoney } from '../context/sendMoneyContext';
import { CreditCard } from 'lucide-react';
import { useAuthRedirect } from '~/api/auth';

export function SendMoney() {
  const {
    showSendFormModal,
    setShowSendFormModal,
    showProcessingModal,
    transactionStatus,
    startTransaction, 
    cancelTransaction,
  } = useSendMoney();

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const customer = useAuthRedirect();

  // ---------------- VALIDATION ----------------
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


  const handleSendMoney = () => {
    if (!validateForm()) return;

    // We pass the data in the format your API expects
    startTransaction({
      receiverAccountNumber: accountNumber, // Maps to your API payload
      amount: Number(amount),           // Converts string to number
      description: description || "No description provided",
    });
  };

  const resetForm = () => {
    setAccountNumber('');
    setAmount('');
    setDescription('');
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
    setShowSendFormModal(false);
    resetForm();
  };

  return (
    <>
      {/* ---------------- FORM MODAL ---------------- */}
      <Dialog open={showSendFormModal} onOpenChange={setShowSendFormModal}>
        <DialogContent className="sm:max-w-[400px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Send Money</DialogTitle>
            <DialogDescription>
              Enter the recipient's account number and the amount you want to send.
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
              <FieldLabel htmlFor="description">Description note</FieldLabel>
              <Input
                id="description"
                type="text"
                placeholder="What is this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

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
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelForm}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSendMoney} className="flex-1">
              Send Money
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- PROCESSING MODAL ---------------- */}
      <ProcessingModal
        isOpen={showProcessingModal}
        onClose={handleCloseModal}
        status={transactionStatus}
        title="Send Money Transaction"
        description="Your transaction is being processed. Please wait for confirmation."
        amount={amount}
        accountNumber={accountNumber}
        onCancelTransaction={handleCancelTransaction}
      />
    </>
  );
}