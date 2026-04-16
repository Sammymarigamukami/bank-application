'use client';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

interface OverviewTabProps {
  // Matching the profile structure from your API response
  customer: {
    customerId: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    status: string;
    joinedDate: string;
    accountNumber: string;
    currentBalance: number;
    totalDeposit: number;
    totalWithdrawal: number;
  };
  recentTransactions: {
    id: number;
    date: string;
    type: string;
    amount: string | number;
    status: string;
    description: string | null;
  }[];
  loading?: boolean;
}

const formatKES = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(Math.abs(numericAmount));
};

export function OverviewTab({ customer, recentTransactions, loading = false }: OverviewTabProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const joinedDate = new Date(customer.joinedDate);
  const recentActivity = recentTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Personal Information</CardTitle>
          <CardDescription className="text-slate-600">
            Account details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Full Name</p>
              <p className="text-base text-slate-900 mt-1 capitalize">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Username</p>
              <p className="text-base text-slate-900 mt-1">@{customer.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Email Address</p>
              <p className="text-base text-slate-900 mt-1">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Phone Number</p>
              <p className="text-base text-slate-900 mt-1">+{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Account Number</p>
              <p className="font-mono text-base text-slate-900 mt-1 tracking-wider">
                {customer.accountNumber}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Member Since</p>
              <p className="text-base text-slate-900 mt-1">
                {joinedDate.toLocaleDateString('en-KE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Summary Metrics */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Account Summary</CardTitle>
          <CardDescription className="text-slate-600">
            Lifetime financial activity overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <p className="text-sm font-medium text-emerald-700">Total Deposits</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">
                {formatKES(customer.totalDeposit)}
              </p>
            </div>
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
              <p className="text-sm font-medium text-rose-700">Total Withdrawals</p>
              <p className="text-2xl font-bold text-rose-600 mt-2">
                {formatKES(customer.totalWithdrawal)}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm font-medium text-slate-600">Current Balance</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {formatKES(customer.currentBalance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">Recent Activity</CardTitle>
            <CardDescription className="text-slate-600">
              Latest account movements
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {transaction.description || `${transaction.type} Transaction`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(transaction.date).toLocaleDateString('en-KE', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      transaction.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'} {formatKES(transaction.amount)}
                    </p>
                    <Badge variant="outline" className="mt-1 h-5 text-[10px] uppercase font-bold tracking-tight">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No recent transactions found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}