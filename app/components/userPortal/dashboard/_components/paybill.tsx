'use client';

import { useState, useEffect } from 'react';
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
import { Label } from '~/components/ui/label'; // Changed from Field to standard Label for consistency
import { ProcessingModal } from './processing-modal';
import { usePaybill } from '../context/paybillContext';
import { Building2, CreditCard } from 'lucide-react';
import { useAuthRedirect } from '~/api/auth';

export function Paybill() {
  const {
    showFormModalPaybill,
    setShowFormModalPaybill,
    showProcessingModal,
    transactionStatus,
    startTransaction,
    cancelTransaction,
    selectedCategory, // Assuming your context now tracks the category clicked
  } = usePaybill();

  const [paybillNumber, setPaybillNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const customer = useAuthRedirect();

  // Sync internal state if a category was selected from the dashboard
  useEffect(() => {
    if (selectedCategory) {
      setPaybillNumber(selectedCategory.paybill);
    }
  }, [selectedCategory]);

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!paybillNumber.trim()) {
      newErrors.paybillNumber = 'Paybill number is required';
    }

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
  const handlePayBill = () => {
    if (!validateForm()) return;

    // This calls the context function which should trigger processPaybill (API)
    startTransaction({
      businessNumber: paybillNumber,
      accountReference: accountNumber,
      amount: parseFloat(amount),
      description: description || `Payment to ${selectedCategory?.name || paybillNumber}`,
    });
  };

  const resetForm = () => {
    // Only reset paybill if no category is forced
    if (!selectedCategory) setPaybillNumber('');
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
    setShowFormModalPaybill(false);
    resetForm();
  };

  return (
    <>
      {/* ---------------- FORM MODAL ---------------- */}
      <Dialog open={showFormModalPaybill} onOpenChange={setShowFormModalPaybill}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCategory?.icon && (
                <selectedCategory.icon className={`h-5 w-5 ${selectedCategory.color}`} />
              )}
              Pay {selectedCategory?.name || 'Bill'}
            </DialogTitle>
            <DialogDescription>
              Enter the details below to process your payment securely.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Paybill Number (Read-only if selected from category) */}
            <div className="space-y-2">
              <Label htmlFor="paybill-number">Business Number (Paybill)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="paybill-number"
                  value={paybillNumber}
                  readOnly={!!selectedCategory}
                  onChange={(e) => setPaybillNumber(e.target.value)}
                  className={`pl-9 ${selectedCategory ? 'bg-muted' : ''} ${
                    errors.paybillNumber ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.paybillNumber && (
                <p className="text-xs text-red-500">{errors.paybillNumber}</p>
              )}
            </div>

            {/* Account Reference */}
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Reference (e.g. Meter No)</Label>
              <Input
                id="account-number"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  if (errors.accountNumber) setErrors({ ...errors, accountNumber: '' });
                }}
                className={errors.accountNumber ? 'border-red-500' : ''}
              />
              {errors.accountNumber && (
                <p className="text-xs text-red-500">{errors.accountNumber}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold text-muted-foreground">KES</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors({ ...errors, amount: '' });
                  }}
                  className={`pl-12 ${errors.amount ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Balance Indicator */}
            <div className="rounded-lg bg-primary/5 p-3 flex items-center justify-between border border-primary/10">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Wallet Balance</span>
              </div>
              <span className="text-xs font-bold">Ksh {
                customer?.accounts?.current?.[0]?.balance?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? "0.00"
              }</span>
            </div>
          </div>

          <DialogFooter className="sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={handleCancelForm}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handlePayBill} className="flex-1">
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- PROCESSING MODAL ---------------- */}
      <ProcessingModal
        isOpen={showProcessingModal}
        onClose={handleCloseModal}
        status={transactionStatus}
        title="Pay Bill Transaction"
        description="Your payment is being processed. Please wait for confirmation."
        amount={amount}
        paybillNumber={paybillNumber}
        onCancelTransaction={handleCancelTransaction}
      />
    </>
  );
}