'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

type TransactionStatus = 'idle' | 'pending' | 'success' | 'failed';

interface ProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: TransactionStatus;
  title: string;
  description?: string;
  amount?: string;
  accountNumber?: string;
  paybillNumber?: string;
  onCancelTransaction: () => void;
}

export function ProcessingModal({
  isOpen,
  onClose,
  status,
  title,
  description,
  amount,
  accountNumber,
  paybillNumber,
  onCancelTransaction,
}: ProcessingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-6 py-8">
          {/* Pending State */}
          {status === 'pending' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">Processing Transaction</p>
                {amount && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Amount: KES {amount}
                  </p>
                )}
                {accountNumber && (
                  <p className="text-sm text-muted-foreground">
                    Account: {accountNumber}
                  </p>
                )}
                {paybillNumber && (
                  <p className="text-sm text-muted-foreground">
                    Paybill: {paybillNumber}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Please wait while we process your transaction...
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">Transaction Successful</p>
                {amount && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Amount: KES {amount}
                  </p>
                )}
                {accountNumber && (
                  <p className="text-sm text-muted-foreground">
                    Account: {accountNumber}
                  </p>
                )}
                {paybillNumber && (
                  <p className="text-sm text-muted-foreground">
                    Paybill: {paybillNumber}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Your transaction has been completed successfully.
                </p>
              </div>
            </div>
          )}

          {/* Failed State */}
          {status === 'failed' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <XCircle className="w-12 h-12 text-red-500" />
              <div className="text-center">
                <p className="text-lg font-semibold text-red-600">Transaction Failed</p>
                {amount && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Amount: KES {amount}
                  </p>
                )}
                {accountNumber && (
                  <p className="text-sm text-muted-foreground">
                    Account: {accountNumber}
                  </p>
                )}
                {paybillNumber && (
                  <p className="text-sm text-muted-foreground">
                    Paybill: {paybillNumber}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Please try again or contact support for assistance.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dialog Actions */}
        <DialogFooter className="gap-2">
          {status === 'pending' && (
            <Button
              variant="outline"
              onClick={onCancelTransaction}
              className="flex-1"
            >
              Cancel Transaction
            </Button>
          )}
          {(status === 'success' || status === 'failed') && (
            <Button
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
