'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AccountTable } from '../_components/accountTable';
import { getActiveAccountsReport } from '~/api/auth';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const data = await getActiveAccountsReport();
        setAccounts(data);
      } catch (error) {
        console.error("Failed to load account report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-600 mt-2">View and manage all customer accounts</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Account
        </Button>
      </div>

      {/* State Handling */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary/60" />
          <p className="text-slate-500 animate-pulse">Fetching financial records...</p>
        </div>
      ) : (
        <AccountTable accounts={accounts} />
      )}
    </div>
  );
}