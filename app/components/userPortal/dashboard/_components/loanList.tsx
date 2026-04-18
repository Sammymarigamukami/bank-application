'use client';

import { useEffect, useState } from 'react';
import { Card } from '~/components/ui/card';
import { 
  Loader2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { getCustomerLoans } from '~/api/auth';
import { toast } from 'sonner';

interface Loan {
  loan_id: number;
  amount: string;
  duration_months: number;
  interest_rate: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  created_at: string;
  type_name: string;
  id_doc_url: string;
  bank_stmt_url: string;
}

export default function UserLoansList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await getCustomerLoans();
        if (response.success) {
          setLoans(response.data);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load loan history");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case 'rejected':
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Loan Applications</h2>
        <span className="text-sm text-slate-500">{loans.length} Total Applications</span>
      </div>

      {loans.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">You haven't applied for any loans yet.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse bg-white dark:bg-slate-900">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Loan Type</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Applied On</th>
                <th className="px-6 py-4 font-semibold text-right">Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loans.map((loan) => (
                <tr key={loan.loan_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{loan.type_name}</div>
                    <div className="text-xs text-slate-500">{loan.duration_months} Months @ {loan.interest_rate}%</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Ksh {Number(loan.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(loan.status)}`}>
                      {getStatusIcon(loan.status)}
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(loan.created_at).toLocaleDateString('en-KE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={loan.id_doc_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors"
                        title="View ID Document"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}