import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { Search, X } from 'lucide-react';
import type { LoanStatus } from '~/lib/type';
import { Button } from '~/components/ui/button';
import { STATUS_DISPLAY_NAMES } from '~/lib/loan-status-transaction';

interface LoanFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: LoanStatus | 'all';
  onStatusChange: (status: LoanStatus | 'all') => void;
}

const LOAN_STATUSES: (LoanStatus | 'all')[] = ['all', 'pending', 'approved', 'rejected', 'disbursed', 'active', 'closed', 'defaulted'];

export function LoanFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: LoanFiltersProps) {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or loan ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Select value={selectedStatus} onValueChange={(value) => onStatusChange(value as LoanStatus | 'all')}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {LOAN_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status === 'all' ? 'All Statuses' : STATUS_DISPLAY_NAMES[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
