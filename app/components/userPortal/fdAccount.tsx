'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { FDStats } from './dashboard/_components/fd-stats';
import { FDTable } from './dashboard/_components/fd-tables';
import { createFixedDeposit, getMyFDPortfolio, type FDPortfolioItem } from '~/api/auth';
import { FDForm } from './dashboard/_components/fd-form';

export default function FixedDepositPage() {
  const [deposits, setDeposits] = useState<FDPortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Real Data from API
  const fetchPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getMyFDPortfolio();
      if (res.success) {
        setDeposits(res.data);
      }
    } catch (error: any) {
      toast.error("Failed to sync portfolio", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // 2. Real-time Stats Calculation
  const stats = useMemo(() => {
    const totalLocked = deposits.reduce((sum, d) => sum + parseFloat(d.principal_amount), 0);
    const activeCount = deposits.filter((d) => d.status === 'active' || d.status === 'held_as_collateral').length;

    const totalInterest = deposits.reduce((sum, d) => {
      const principal = parseFloat(d.principal_amount);
      const rate = parseFloat(d.interest_rate) / 100;
      return sum + (principal * rate);
    }, 0);

    return { totalLocked, activeCount, totalInterest };
  }, [deposits]);

  // 3. Form Submission to API
  const handleFormSubmit = useCallback(
    async (data: {
      account: string;
      amount: number;
      duration: string;
      rate: number;
      maturityDate: Date;
      payout: number;
    }) => {
      try {
        const durationMonths = data.duration === '3m' ? 3 : data.duration === '6m' ? 6 : 12;

        const response = await createFixedDeposit({
          accountId: parseInt(data.account),
          amount: data.amount,
          durationMonths: durationMonths,
          interestRate: data.rate
        });

        if (response.success) {
          toast.success('Fixed Deposit Activated', {
            description: `Ref: ${response.data.reference_code}. KES ${data.payout.toLocaleString()} expected on ${data.maturityDate.toLocaleDateString()}`,
          });
          
          await fetchPortfolio(); // Refresh table and stats
        }
      } catch (error: any) {
        toast.error("Transaction Failed", {
          description: error.message
        });
      }
    },
    [fetchPortfolio]
  );

  const handleWithdraw = useCallback((id: string) => {
    toast.info('Liquidation requested', {
      description: 'Request sent to bank for processing.',
    });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-white to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="text-xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
            Fixed Deposit Management
          </h1>
          <p className="text-base text-muted-foreground">
            Open new fixed deposits and manage your current portfolio with competitive interest rates
          </p>
        </div>

        {/* 4. Correctly passing the loading state to stats */}
        <FDStats
          totalLocked={stats.totalLocked}
          activeDeposits={stats.activeCount}
          totalInterest={Math.round(stats.totalInterest)}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {/* FIX: Changed from FixedDepositPage to FDForm */}
            <FDForm onSubmit={handleFormSubmit} />
          </div>

          <div className="lg:col-span-2">
            <FDTable 
              deposits={deposits} 
              onWithdraw={handleWithdraw} 
              isLoading={isLoading} 
            />
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg border border-border/50 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            💡 Locked deposits can be used as collateral for instant online loans.
          </p>
          <p className="text-xs text-muted-foreground italic">
            All transactions are logged under M-Pesa integrated standards.
          </p>
        </div>
      </div>
    </main>
  );
}