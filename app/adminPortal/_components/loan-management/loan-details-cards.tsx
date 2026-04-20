import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { LoanStatusBadge } from '~/lib/loan-status-badge';
import type { Loan } from '~/lib/type';
import { formatDate } from '~/lib/utils';


interface LoanDetailsCardProps {
  loan: Loan | null;
  isLoading: boolean;
}

export function LoanDetailsCard({ loan, isLoading }: LoanDetailsCardProps) {
  if (isLoading || !loan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const details = [
    { label: 'Loan ID', value: loan.loan_id },
    { label: 'Customer Name', value: loan.customer_name },
    { label: 'Email', value: loan.customer_email },
    { label: 'Loan Type', value: loan.loan_type },
    { label: 'Amount', value: `₹${loan.amount}` },
    { label: 'Duration', value: `${loan.duration_months} months` },
    { label: 'Interest Rate', value: loan.interest_rate },
    { label: 'Purpose', value: loan.purpose },
    { label: 'Employment Status', value: loan.employment_status },
    { label: 'Monthly Income', value: `₹${loan.monthly_income}` },
    { label: 'Created At', value: formatDate(loan.created_at) },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Loan Information</CardTitle>
        <LoanStatusBadge status={loan.status} size="lg" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
              <p className="text-base font-semibold">{detail.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
