'use client';

import { Card } from '~/components/ui/card';
import { TrendingUp, Lock, DollarSign } from 'lucide-react';

interface FDStatsProps {
  totalLocked: number;
  activeDeposits: number;
  totalInterest: number;
  isLoading: boolean;
}

export function FDStats({ totalLocked, activeDeposits, totalInterest, isLoading }: FDStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-6 bg-white border-primary/10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Locked Amount</p>
            <p className="text-3xl font-bold text-primary">
              KES {totalLocked.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <Lock className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white border-accent/10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Deposits</p>
            <p className="text-3xl font-bold text-primary">{activeDeposits}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white border-primary/10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Interest Earned</p>
            <p className="text-3xl font-bold text-primary">
              KES {totalInterest.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>
    </div>
  );
}
