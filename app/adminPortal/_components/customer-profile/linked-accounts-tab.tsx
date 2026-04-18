'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '~/components/ui/empty';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { CreditCard, Wallet, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { activateCustomerAccount } from '~/api/auth';

interface LinkedAccount {
  account_number: string;
  status: string;
  balance: number | string;
  type?: 'business' | 'savings';
}

interface LinkedAccountsTabProps {
  customerId?: string | number;
  linkedAccounts?: LinkedAccount[];
  loading?: boolean;
  onUpdate?: () => void;
}

const formatKES = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(numericAmount);
};

export function LinkedAccountsTab({ 
  linkedAccounts = [], 
  loading = false, 
  customerId, 
  onUpdate 
}: LinkedAccountsTabProps) {
  const [processingId, setProcessingId] = useState<string | number | null>(null);

  const handleActivation = async (accountType: 'business' | 'savings', id: string | number) => {
    if (!customerId) return;
    
    setProcessingId(id);
    try {
      const response = await activateCustomerAccount(customerId, accountType);
      // Assuming your backend returns { kind: 'success' } or { success: true }
      if (response.kind === 'success' || response.success) {
        toast.success(response.message || `${accountType} account activated.`);
        if (onUpdate) onUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process activation.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-slate-800" />
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
        const accountId = account.id || index;
        const currentType = (account.type?.toLowerCase() as 'business' | 'savings') || 'savings';

        return (
          <Card key={accountId} className="border border-slate-200 shadow-sm overflow-hidden">
            <div className={`h-1 w-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Wallet className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 text-base capitalize">
                      {currentType} Account
                    </CardTitle>
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
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Account Type</p>
                    <p className="text-sm font-semibold text-slate-700 mt-1 capitalize">
                      {currentType}
                    </p>
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

                <div className="flex items-center gap-2">
                  {!isActive ? (
                    <Button
                      size="sm"
                      onClick={() => handleActivation(currentType, accountId)}
                      disabled={processingId === accountId}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {processingId === accountId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      // onClick logic for deactivation can be added here once that API is ready
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Deactivate
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}