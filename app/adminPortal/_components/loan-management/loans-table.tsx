import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { LoanStatusBadge } from '~/lib/loan-status-badge';
import { formatDate } from '~/lib/utils';
import { LoanActionsMenu } from './loan-actions-menu';
import type { Loan } from '~/lib/type';

interface LoansTableProps {
  loans: Loan[];
  isLoading: boolean;
  onRowClick: (loanId: number) => void;
  onApprove: (loanId: number) => void;
  onReject: (loanId: number) => void;
  onDisburse: (loanId: number) => void;
  onActivate: (loanId: number) => void;
  onClose: (loanId: number) => void;
  onDefaulted: (loanId: number) => void;
}

export function LoansTable({
  loans,
  isLoading,
  onRowClick,
  onApprove,
  onReject,
  onDisburse,
  onActivate,
  onClose,
  onDefaulted,
}: LoansTableProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Loan ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  if (loans.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No loans found. Try adjusting your filters.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Loan ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Loan Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[50px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.loan_id} className="hover:bg-muted/50 cursor-pointer transition-colors">
              <TableCell
                className="font-medium text-blue-600 hover:underline"
                onClick={() => onRowClick(loan.loan_id)}
              >
                {loan.loan_id}
              </TableCell>
              <TableCell onClick={() => onRowClick(loan.loan_id)}>{loan.customer_name}</TableCell>
              <TableCell onClick={() => onRowClick(loan.loan_id)} className="text-sm text-muted-foreground">
                {loan.customer_email}
              </TableCell>
              <TableCell onClick={() => onRowClick(loan.loan_id)}>{loan.loan_type}</TableCell>
              <TableCell className="text-right font-semibold" onClick={() => onRowClick(loan.loan_id)}>
                ₹{loan.amount}
              </TableCell>
              <TableCell onClick={() => onRowClick(loan.loan_id)}>{loan.duration_months} months</TableCell>
              <TableCell onClick={() => onRowClick(loan.loan_id)}>{loan.interest_rate}</TableCell>
              <TableCell onClick={() => onRowClick(loan.loan_id)}>
                <LoanStatusBadge status={loan.status} />
              </TableCell>
              <TableCell onClick={() => onRowClick(loan.loan_id)} className="text-sm text-muted-foreground">
                {formatDate(loan.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <LoanActionsMenu
                  loanId={loan.loan_id}
                  currentStatus={loan.status}
                  onViewDetails={() => onRowClick(loan.loan_id)}
                  onApprove={() => onApprove(loan.loan_id)}
                  onReject={() => onReject(loan.loan_id)}
                  onDisburse={() => onDisburse(loan.loan_id)}
                  onActivate={() => onActivate(loan.loan_id)}
                  onClose={() => onClose(loan.loan_id)}
                  onDefaulted={() => onDefaulted(loan.loan_id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
