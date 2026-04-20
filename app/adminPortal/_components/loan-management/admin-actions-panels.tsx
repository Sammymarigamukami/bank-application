import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { CheckCircle2, XCircle, Wallet, Play, X, AlertCircle } from 'lucide-react';
import type { LoanStatus } from '~/lib/type';
import { canTransitionTo, STATUS_DISPLAY_NAMES } from '~/lib/loan-status-transaction';

interface AdminActionsPanelProps {
  currentStatus: LoanStatus;
  isLoading: boolean;
  onStatusChange: (newStatus: LoanStatus) => void;
}

const ACTIONS: Array<{
  status: LoanStatus;
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  description: string;
}> = [
  {
    status: 'approved',
    label: 'Approve',
    icon: <CheckCircle2 className="h-4 w-4" />,
    variant: 'default',
    description: 'Approve this loan application',
  },
  {
    status: 'rejected',
    label: 'Reject',
    icon: <XCircle className="h-4 w-4" />,
    variant: 'destructive',
    description: 'Reject this loan application',
  },
  {
    status: 'disbursed',
    label: 'Disburse',
    icon: <Wallet className="h-4 w-4" />,
    variant: 'default',
    description: 'Mark as disbursed',
  },
  {
    status: 'active',
    label: 'Activate',
    icon: <Play className="h-4 w-4" />,
    variant: 'default',
    description: 'Mark as active',
  },
  {
    status: 'closed',
    label: 'Close',
    icon: <X className="h-4 w-4" />,
    variant: 'outline',
    description: 'Close this loan',
  },
  {
    status: 'defaulted',
    label: 'Mark as Defaulted',
    icon: <AlertCircle className="h-4 w-4" />,
    variant: 'destructive',
    description: 'Mark as defaulted',
  },
];

export function AdminActionsPanel({ currentStatus, isLoading, onStatusChange }: AdminActionsPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableActions = ACTIONS.filter((action) => canTransitionTo(currentStatus, action.status));

  if (availableActions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No available actions for loans with status <span className="font-semibold">{STATUS_DISPLAY_NAMES[currentStatus]}</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {availableActions.map((action) => (
            <Button
              key={action.status}
              onClick={() => onStatusChange(action.status)}
              variant={action.variant}
              className="justify-start"
              title={action.description}
            >
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
