import { Badge } from '~/components/ui/badge';
import { STATUS_DISPLAY_NAMES } from '~/lib/loan-status-transaction';
import { STATUS_COLORS, type LoanStatus } from '~/lib/type';

interface LoanStatusBadgeProps {
  status: LoanStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function LoanStatusBadge({ status, size = 'md' }: LoanStatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  const displayName = STATUS_DISPLAY_NAMES[status];

  return (
    <Badge
      className={`${colors.badge} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-3 py-1' : 'text-sm px-2.5 py-0.5'
      } font-semibold`}
    >
      {displayName}
    </Badge>
  );
}
