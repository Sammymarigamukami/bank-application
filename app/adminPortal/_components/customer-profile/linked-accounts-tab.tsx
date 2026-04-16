'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '~/components/ui/empty';
import { Badge } from '~/components/ui/badge';
import { CreditCard, Wallet } from 'lucide-react';

interface LinkedAccount {
  account_number: string;
  status: string;
  balance: number | string;
  id?: string | number;
}

interface LinkedAccountsTabProps {
  linkedAccounts?: LinkedAccount[];
  loading?: boolean;
}

const formatKES = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(numericAmount);
};

export function LinkedAccountsTab({ linkedAccounts = [], loading = false }: LinkedAccountsTabProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />
        <p className="text-sm text-slate-500">Loading linked accounts...</p>
      </div>
    );
  }

  if (linkedAccounts.length === 0) {
    return (
      <Empty className="border-2 border-dashed border-slate-100 rounded-xl">
        <EmptyMedia>
          <CreditCard className="w-8 h-8 text-slate-300" />
        </EmptyMedia>
        <EmptyTitle>No linked accounts</EmptyTitle>
        <EmptyDescription>
          This customer hasn't linked any additional bank or mobile money accounts yet.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="grid gap-4">
      {linkedAccounts.map((account, index) => {
        const isActive = account.status.toLowerCase() === 'active';
        
        return (
          <Card key={account.id || index} className="border border-slate-200 shadow-sm overflow-hidden">
            <div className={`h-1 w-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Wallet className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 text-base">Primary Savings Account</CardTitle>
                    <CardDescription className="text-slate-500 font-mono text-xs mt-0.5">
                      {account.account_number}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900 tracking-tight">
                    {formatKES(account.balance)}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Available Balance</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-slate-50/50 py-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Account Type</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">Standard Personal</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                  <div className="mt-1">
                    <Badge 
                      className={isActive 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' 
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200'
                      }
                    >
                      {account.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}