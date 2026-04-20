import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

import { fetchCustomerAccounts, fetchLoanById, updateLoanStatus } from '~/lib/api-client';
import type { CustomerAccount, Loan, LoanStatus } from '~/lib/type';
import { canTransitionTo } from '~/lib/loan-status-transaction';
import { LoanDetailsCard } from '../_components/loan-management/loan-details-cards';
import { CustomerDocuments } from '../_components/loan-management/customer-documents';
import { CustomerAccounts } from '../_components/loan-management/customer-accounts';
import { AdminActionsPanel } from '../_components/loan-management/admin-actions-panels';
import { StatusTransitionModal } from '../_components/loan-management/status-transition-model';

export default function LoanDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const loanId = parseInt(id || '0');

  const [loan, setLoan] = useState<Loan | null>(null);
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [isLoanLoading, setIsLoanLoading] = useState(true);
  const [isAccountsLoading, setIsAccountsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<LoanStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load loan details
  useEffect(() => {
    const loadLoan = async () => {
      try {
        setIsLoanLoading(true);
        const data = await fetchLoanById(loanId);
        if (data) {
          setLoan(data);
        } else {
          toast.error('Loan not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to load loan:', error);
        toast.error('Failed to load loan details');
      } finally {
        setIsLoanLoading(false);
      }
    };

    if (loanId) {
      loadLoan();
    }
  }, [loanId, navigate]);

  // Load customer accounts
  useEffect(() => {
    const loadAccounts = async () => {
      if (!loan) return;

      try {
        setIsAccountsLoading(true);
        const data = await fetchCustomerAccounts(loan.customer_id);
        setAccounts(data);
      } catch (error) {
        console.error('Failed to load accounts:', error);
        toast.error('Failed to load customer accounts');
      } finally {
        setIsAccountsLoading(false);
      }
    };

    loadAccounts();
  }, [loan]);

  const handleStatusChange = (newStatus: LoanStatus) => {
    if (!loan || !canTransitionTo(loan.status, newStatus)) {
      toast.error('Invalid status transition');
      return;
    }

    setTargetStatus(newStatus);
    setIsModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!targetStatus || !loan) return;

    try {
      setIsProcessing(true);
      const updatedLoan = await updateLoanStatus(loan.loan_id, targetStatus);
      
      if (updatedLoan) {
        setLoan(updatedLoan);
        toast.success(`Loan status updated to ${targetStatus}`);
      }
    } catch (error) {
      console.error('Failed to update loan status:', error);
      toast.error('Failed to update loan status');
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setTargetStatus(null);
    }
  };

  if (isLoanLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96 w-full" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/')}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Loan Details
          </h1>
          <p className="mt-1 text-muted-foreground">
            Loan ID: <span className="font-semibold">{loanId}</span>
          </p>
        </div>
      </div>

      <LoanDetailsCard loan={loan} isLoading={isLoanLoading} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <CustomerDocuments
            idDocUrl={loan?.id_doc_url || ''}
            bankStmtUrl={loan?.bank_stmt_url || ''}
            isLoading={false}
          />

          <CustomerAccounts accounts={accounts} isLoading={isAccountsLoading} />
        </div>

        <div>
          {loan && (
            <AdminActionsPanel
              currentStatus={loan.status}
              isLoading={false}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>

      {loan && targetStatus && (
        <StatusTransitionModal
          isOpen={isModalOpen}
          currentStatus={loan.status}
          targetStatus={targetStatus}
          loanId={loan.loan_id}
          isLoading={isProcessing}
          onConfirm={handleConfirmStatusChange}
          onCancel={() => {
            setIsModalOpen(false);
            setTargetStatus(null);
          }}
        />
      )}
    </div>
  );
}
