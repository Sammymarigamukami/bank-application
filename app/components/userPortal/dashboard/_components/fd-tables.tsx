'use client';

import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Trash2, Lock } from 'lucide-react';
import type { FDPortfolioItem } from '~/api/auth';


interface FDTableProps {
  deposits: FDPortfolioItem[];
  onWithdraw: (id: string) => void;
  isLoading?: boolean;
}

export function FDTable({ deposits, onWithdraw, isLoading }: FDTableProps) {
  // Helper to normalize backend status to UI colors
  const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'active') {
      return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
    }
    if (s === 'held_as_collateral' || s === 'locked') {
      return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    }
    if (s === 'matured') {
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <Card className="p-6 bg-white border-primary/10 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-4">Portfolio Overview</h2>

      {isLoading ? (
        <div className="space-y-4 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      ) : deposits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-5xl mb-4">💼</div>
          <p className="text-lg font-semibold text-foreground mb-2">No Portfolio Data</p>
          <p className="text-sm text-muted-foreground">You don't have any active fixed deposits at the moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Principal</TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rate</TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Maturity Date</TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.map((deposit) => {
                const isLocked = deposit.status.toLowerCase() === 'held_as_collateral';
                
                return (
                  <TableRow key={deposit.fd_id} className="border-b border-border/30 hover:bg-secondary/40 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      FD-{deposit.fd_id}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      KES {parseFloat(deposit.principal_amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-primary">{deposit.interest_rate}%</span>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {new Date(deposit.maturity_date).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusStyles(deposit.status)} font-bold text-[10px] uppercase tracking-tight`}
                      >
                        {isLocked && <Lock className="w-3 h-3 mr-1" />}
                        {deposit.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onWithdraw(deposit.fd_id.toString())}
                        disabled={isLocked}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
                        title={isLocked ? 'Cannot liquidate collateral' : 'Liquidate deposit'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}