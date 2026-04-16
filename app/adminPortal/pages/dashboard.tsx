'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { StatCard } from '../_components/statCard';
import { RecentActivityTable } from '../_components/recentActivityTable';
import { getAdminDashboardStats } from '~/api/auth';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

const fetchDashboardData = async () => {
  try {
    // This now returns the 'data' object directly because of your return statement
    const statsData = await getAdminDashboardStats(); 
    
    if (statsData) {
      setStats(statsData); // stats is now { totalCustomers: 23, ... }
    }
  } catch (error) {
    console.error("Dashboard fetch error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return <div className="p-8 text-slate-600 font-medium text-center">Loading NexusBank Analytics...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back to NexusBank Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers ?? 0}
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Active Accounts"
          value={stats?.activeAccounts ?? 0}
          icon={<CreditCard className="w-6 h-6" />}
        />
        <StatCard
          title="Total Transactions"
          value={stats?.totalTransactions ?? 0}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <StatCard
          title="M-Pesa Transactions"
          value={stats?.totalMpesaTransactions ?? 0}
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivityTable activities={[]} /> 
    </div>
  );
}