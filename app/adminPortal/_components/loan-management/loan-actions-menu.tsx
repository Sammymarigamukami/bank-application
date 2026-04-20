import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { MoreHorizontal, Eye, CheckCircle2, XCircle, Wallet, Play, X, AlertCircle } from 'lucide-react';
import type { LoanStatus } from '~/lib/type';
import { canTransitionTo, getAvailableTransitions } from '~/lib/loan-status-transaction';

interface LoanActionsMenuProps {
  loanId: number;
  currentStatus: LoanStatus;
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDisburse: () => void;
  onActivate: () => void;
  onClose: () => void;
  onDefaulted: () => void;
}

export function LoanActionsMenu({
  loanId,
  currentStatus,
  onViewDetails,
  onApprove,
  onReject,
  onDisburse,
  onActivate,
  onClose,
  onDefaulted,
}: LoanActionsMenuProps) {
  const availableActions = getAvailableTransitions(currentStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onViewDetails} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>

        {availableActions.length > 0 && <DropdownMenuSeparator />}

        {canTransitionTo(currentStatus, 'approved') && (
          <DropdownMenuItem onClick={onApprove} className="cursor-pointer">
            <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
            <span>Approve Loan</span>
          </DropdownMenuItem>
        )}

        {canTransitionTo(currentStatus, 'rejected') && (
          <DropdownMenuItem onClick={onReject} className="cursor-pointer text-red-600">
            <XCircle className="mr-2 h-4 w-4" />
            <span>Reject Loan</span>
          </DropdownMenuItem>
        )}

        {canTransitionTo(currentStatus, 'disbursed') && (
          <DropdownMenuItem onClick={onDisburse} className="cursor-pointer">
            <Wallet className="mr-2 h-4 w-4 text-purple-600" />
            <span>Mark as Disbursed</span>
          </DropdownMenuItem>
        )}

        {canTransitionTo(currentStatus, 'active') && (
          <DropdownMenuItem onClick={onActivate} className="cursor-pointer">
            <Play className="mr-2 h-4 w-4 text-green-600" />
            <span>Mark as Active</span>
          </DropdownMenuItem>
        )}

        {canTransitionTo(currentStatus, 'closed') && (
          <DropdownMenuItem onClick={onClose} className="cursor-pointer text-gray-600">
            <X className="mr-2 h-4 w-4" />
            <span>Close Loan</span>
          </DropdownMenuItem>
        )}

        {canTransitionTo(currentStatus, 'defaulted') && (
          <DropdownMenuItem onClick={onDefaulted} className="cursor-pointer text-black">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Mark as Defaulted</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
