'use client';

import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import {
  AlertCircle,
  CreditCard,
  TrendingUp,
  Clock,
  Edit2,
  Users,
} from 'lucide-react';

// Importing your defined functions from auth.ts

import { StatCard } from '../_components/customer-profile/stat-card';
import { OverviewTab } from '../_components/customer-profile/overview-tab';
import { TransactionTable } from '../_components/customer-profile/transaction-table';
import { LinkedAccountsTab } from '../_components/customer-profile/linked-accounts-tab';
import { getCustomerFullProfile, updateCustomerStatus } from '~/api/auth';

/**
 * API Response interface matching the backend JSON structure
 */
interface ApiResponse {
  profile: {
    customerId: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    status: string;
    joinedDate: string;
    account_id: number;
    accountNumber: string;
    currentBalance: number;
    totalDeposit: number;
    totalWithdrawal: number;
    transactionCount: number;
  };
  transactions: {
    id: number;
    date: string;
    type: string;
    amount: string | number;
    status: string;
    description: string | null;
  }[];
}

const formatKES = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function CustomerProfilePage() {
  const { customerId } = useParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoized fetcher to allow re-fetching after status updates
  const fetchData = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const result = await getCustomerFullProfile(customerId);
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.error('Error in Page Component:', error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleSuspend = async () => {
    if (!data?.profile || !customerId) return;

    const currentStatus = data.profile.status.toLowerCase();
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

    try {
      const response = await updateCustomerStatus(customerId, newStatus);
      if (response.success) {
        // Re-fetch data to sync UI with database
        fetchData();
      }
    } catch (error) {
      alert(`Failed to update status to ${newStatus}. Please try again.`);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500">Customer profile not found.</p>
      </div>
    );
  }

  const { profile, transactions } = data;
  const isSuspended = profile.status.toLowerCase() === 'suspended';

  // Generate initials for Avatar
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-slate-600 hover:text-slate-900">
              <Link to="/adminPortal">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="text-slate-400" />

          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-slate-600 hover:text-slate-900">
              <Link to="/adminPortal/customers">Customers</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
            <BreadcrumbSeparator className="text-slate-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-900 capitalize">{profile.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 bg-slate-900 text-lg font-semibold text-white">
                  <AvatarFallback className="bg-slate-900 text-white">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold capitalize text-slate-900">{profile.name}</h1>
                  <p className="mt-1 font-mono text-sm text-slate-600">ID: {profile.customerId}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      className={
                        isSuspended
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }
                    >
                      {profile.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 md:w-auto">
                <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-50">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant={isSuspended ? 'default' : 'destructive'}
                  onClick={handleToggleSuspend}
                  className={
                    isSuspended
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }
                >
                  {isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Suspended Account Warning */}
        {isSuspended && (
          <Card className="mb-6 border-rose-200 bg-rose-50">
            <CardContent className="flex items-start gap-3 pt-6">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
              <div>
                <p className="font-semibold text-rose-900">Account Suspended</p>
                <p className="mt-1 text-sm text-rose-800">
                  This account is currently restricted. No new transactions can be processed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid - Mapping to real Backend keys */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Current Balance"
            value={formatKES(profile.currentBalance)}
            icon={<CreditCard className="h-5 w-5" />}
          />
          <StatCard
            title="Total Deposits"
            value={formatKES(profile.totalDeposit)}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Total Withdrawals"
            value={formatKES(profile.totalWithdrawal)}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Transactions"
            value={profile.transactionCount.toString()}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Content Tabs */}
        <Card className="border-0 shadow-sm">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader className="border-b">
              <TabsList className="w-full justify-start bg-slate-50 p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transaction Ledger</TabsTrigger>
                <TabsTrigger value="accounts">Linked Accounts</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="overview" className="m-0">
                <OverviewTab customer={profile} recentTransactions={transactions.slice(0, 5)} />
              </TabsContent>
              <TabsContent value="transactions" className="m-0">
                <TransactionTable transactions={transactions} />
              </TabsContent>
              <TabsContent value="accounts" className="m-0">
                <LinkedAccountsTab 
                  linkedAccounts={[{ 
                    account_number: profile.accountNumber, 
                    status: profile.status,
                    balance: profile.currentBalance 
                  }]} 
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

/**
 * Loading Skeleton Component
 */
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <Skeleton className="mb-6 h-6 w-48" />
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
}