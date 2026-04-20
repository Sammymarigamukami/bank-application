import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { AlertCircle } from 'lucide-react';
import type { LoanStatus } from '~/lib/type';
import { STATUS_DISPLAY_NAMES } from '~/lib/loan-status-transaction';


interface StatusTransitionModalProps {
  isOpen: boolean;
  currentStatus: LoanStatus;
  targetStatus: LoanStatus;
  loanId: number;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TRANSITION_DESCRIPTIONS: Record<string, string> = {
  'pending-approved': 'This loan will be marked as approved and can proceed to disbursement.',
  'pending-rejected': 'This loan will be permanently rejected. This action cannot be undone.',
  'approved-disbursed': 'This loan will be marked as disbursed and the funds will be released.',
  'disbursed-active': 'This loan will be marked as active and repayment will commence.',
  'active-closed': 'This loan will be marked as closed. Future payments will not be accepted.',
  'active-defaulted': 'This loan will be marked as defaulted due to non-payment or breach of terms.',
};

export function StatusTransitionModal({
  isOpen,
  currentStatus,
  targetStatus,
  loanId,
  isLoading,
  onConfirm,
  onCancel,
}: StatusTransitionModalProps) {
  const key = `${currentStatus}-${targetStatus}`;
  const description = TRANSITION_DESCRIPTIONS[key] || 'Are you sure you want to make this change?';
  const isRiskAction = targetStatus === 'rejected' || targetStatus === 'defaulted';

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isRiskAction && <AlertCircle className="h-5 w-5 text-red-600" />}
            Confirm Status Change
          </DialogTitle>
          <DialogDescription>
            Loan ID: <span className="font-semibold">{loanId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium">Current Status: </span>
              {STATUS_DISPLAY_NAMES[currentStatus]}
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm">
              <span className="font-medium">New Status: </span>
              {STATUS_DISPLAY_NAMES[targetStatus]}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">{description}</p>

          {isRiskAction && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-medium text-red-900">⚠️ This is a significant action that cannot be easily reversed.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={isRiskAction ? 'destructive' : 'default'}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}