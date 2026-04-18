'use client';

import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
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
  Loader2,
  UserCheck,
  UserMinus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

// Logic & API Imports
import { StatCard } from '../_components/customer-profile/stat-card';
import { OverviewTab } from '../_components/customer-profile/overview-tab';
import { TransactionTable } from '../_components/customer-profile/transaction-table';
import { LinkedAccountsTab } from '../_components/customer-profile/linked-accounts-tab';
import { 
  getCustomerFullProfile, 
  activateCustomer,
  deactivateCustomer,
  closeCustomerAccount
} from '~/api/auth';

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
    accountType?: string;
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
  const navigate = useNavigate();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const result = await getCustomerFullProfile(customerId);
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Failed to load customer profile.");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusAction = async (action: 'activate' | 'deactivate' | 'close') => {
    if (!customerId) return;
    
    if (action === 'close' && !window.confirm("Are you sure you want to close this account permanently? This action cannot be undone.")) {
      return;
    }

    setIsActionLoading(true);
    try {
      let response;
      if (action === 'activate') response = await activateCustomer(customerId);
      else if (action === 'deactivate') response = await deactivateCustomer(customerId);
      else response = await closeCustomerAccount(customerId);

      if (response.kind === 'success') {
        toast.success(response.message);
        if (action === 'close') {
          navigate('/adminPortal/customers');
        } else {
          // Trigger a re-fetch to update status badges and warning cards
          await fetchData();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!data) return <div className="p-20 text-center">Profile not found.</div>;

  const { profile, transactions } = data;
  const status = profile.status.toLowerCase();
  const isSuspended = status === 'suspended' || status === 'deactivated';
  const isActive = status === 'active';
  const isClosed = status === 'closed';
  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-slate-600 hover:text-slate-900">
                <Link to="/adminPortal">Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-slate-600 hover:text-slate-900">
                <Link to="/adminPortal/customers">Customers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-900 capitalize">{profile.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Action Header Card */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 bg-slate-900 text-lg font-semibold text-white">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold capitalize text-slate-900">{profile.name}</h1>
                  <p className="mt-1 font-mono text-sm text-slate-600">ID: {profile.customerId}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={
                      isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                      isClosed ? 'bg-slate-100 text-slate-800' : 'bg-rose-100 text-rose-800'
                    }>
                      {profile.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-wrap gap-2 md:w-auto">
                {!isClosed && (
                  <>
                    <Button variant="outline" className="border-slate-200 text-slate-900 bg-white">
                      <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>

                    {isActive ? (
                      <Button 
                        onClick={() => handleStatusAction('deactivate')}
                        disabled={isActionLoading}
                        className="bg-amber-600 hover:bg-amber-700 text-white border-none"
                      >
                        {isActionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <UserMinus className="mr-2 h-4 w-4" />}
                        Deactivate
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleStatusAction('activate')}
                        disabled={isActionLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {isActionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                        Activate
                      </Button>
                    )}

                    <Button 
                      variant="destructive"
                      onClick={() => handleStatusAction('close')}
                      disabled={isActionLoading}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      {isActionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                      Close Account
                    </Button>
                  </>
                )}

                {isClosed && (
                  <Badge variant="outline" className="text-slate-400 py-2 px-4 border-dashed border-slate-300 bg-slate-50">
                    This account is permanently closed
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Warning Card */}
        {isSuspended && (
          <Card className="mb-6 border-rose-200 bg-rose-50 shadow-none">
            <CardContent className="flex items-start gap-3 pt-6">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
              <div>
                <p className="font-semibold text-rose-900">Account Suspended</p>
                <p className="mt-1 text-sm text-rose-800">No new transactions or logins can be processed for this customer until reactivated.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Current Balance" value={formatKES(profile.currentBalance)} icon={<CreditCard className="h-5 w-5" />} />
          <StatCard title="Total Deposits" value={formatKES(profile.totalDeposit)} icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard title="Total Withdrawals" value={formatKES(profile.totalWithdrawal)} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Transactions" value={profile.transactionCount.toString()} icon={<Clock className="h-5 w-5" />} />
        </div>

        {/* Tabs Section */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader className="border-b bg-white p-0">
              <TabsList className="h-14 w-full justify-start bg-transparent px-6 space-x-6">
                <TabsTrigger value="overview" className="h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 bg-transparent px-0 shadow-none">Overview</TabsTrigger>
                <TabsTrigger value="transactions" className="h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 bg-transparent px-0 shadow-none">Transaction Ledger</TabsTrigger>
                <TabsTrigger value="accounts" className="h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 bg-transparent px-0 shadow-none">Linked Accounts</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-6">
              <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                <OverviewTab customer={profile} recentTransactions={transactions.slice(0, 5)} />
              </TabsContent>
              <TabsContent value="transactions" className="m-0 focus-visible:outline-none">
                <TransactionTable transactions={transactions} />
              </TabsContent>
              <TabsContent value="accounts" className="m-0 focus-visible:outline-none">
                <LinkedAccountsTab 
                  customerId={customerId}
                  onUpdate={fetchData} 
                  linkedAccounts={[{ 
                    account_number: profile.accountNumber, 
                    status: profile.status,
                    balance: profile.currentBalance,
                    type: (profile.accountType as any) || 'savings'
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

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}