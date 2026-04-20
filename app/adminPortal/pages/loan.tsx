import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';
import { fetchAllLoans, updateLoanStatus } from '~/lib/api-client';
import { canTransitionTo } from '~/lib/loan-status-transaction';
import type { Loan, LoanStatus } from '~/lib/type';
import { LoanFilters } from '../_components/loan-management/loan-filter';
import { LoansTable } from '../_components/loan-management/loans-table';
import { StatusTransitionModal } from '../_components/loan-management/status-transition-model';


export default function LoansPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const [targetStatus, setTargetStatus] = useState<LoanStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load loans on mount
  useEffect(() => {
    const loadLoans = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllLoans();
        setLoans(data);
      } catch (error) {
        console.error('Failed to load loans:', error);
        toast.error('Failed to load loans');
      } finally {
        setIsLoading(false);
      }
    };

    loadLoans();
  }, []);

  // Filter and search loans
  const filteredLoans = useMemo(() => {
    let result = loans;

    if (searchQuery) {
      result = result.filter(
        (loan) =>
          loan.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loan.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loan.loan_id.toString().includes(searchQuery)
      );
    }

    if (selectedStatus !== 'all') {
      result = result.filter((loan) => loan.status === selectedStatus);
    }

    return result;
  }, [loans, searchQuery, selectedStatus]);

  const handleStatusChange = (loanId: number, newStatus: LoanStatus) => {
    const loan = loans.find((l) => l.loan_id === loanId);
    if (!loan) return;

    if (!canTransitionTo(loan.status, newStatus)) {
      toast.error('Invalid status transition');
      return;
    }

    setSelectedLoanId(loanId);
    setTargetStatus(newStatus);
    setIsModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedLoanId || !targetStatus) return;

    try {
      setIsProcessing(true);
      const updatedLoan = await updateLoanStatus(selectedLoanId, targetStatus);
      
      if (updatedLoan) {
        setLoans((prevLoans) =>
          prevLoans.map((loan) => (loan.loan_id === selectedLoanId ? updatedLoan : loan))
        );
        toast.success(`Loan status updated to ${targetStatus}`);
      }
    } catch (error) {
      console.error('Failed to update loan status:', error);
      toast.error('Failed to update loan status');
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setSelectedLoanId(null);
      setTargetStatus(null);
    }
  };

  const handleNavigateToDetails = (loanId: number) => {
    navigate(`${loanId}`);
  };

  const currentLoan = selectedLoanId ? loans.find((l) => l.loan_id === selectedLoanId) : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all loans in the system
        </p>
      </div>

      <LoanFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm">
        Showing <span className="font-semibold">{filteredLoans.length}</span> of{' '}
        <span className="font-semibold">{loans.length}</span> loans
      </div>

      <LoansTable
        loans={filteredLoans}
        isLoading={isLoading}
        onRowClick={handleNavigateToDetails}
        onApprove={(id) => handleStatusChange(id, 'approved')}
        onReject={(id) => handleStatusChange(id, 'rejected')}
        onDisburse={(id) => handleStatusChange(id, 'disbursed')}
        onActivate={(id) => handleStatusChange(id, 'active')}
        onClose={(id) => handleStatusChange(id, 'closed')}
        onDefaulted={(id) => handleStatusChange(id, 'defaulted')}
      />

      {currentLoan && targetStatus && (
        <StatusTransitionModal
          isOpen={isModalOpen}
          currentStatus={currentLoan.status}
          targetStatus={targetStatus}
          loanId={currentLoan.loan_id}
          isLoading={isProcessing}
          onConfirm={handleConfirmStatusChange}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedLoanId(null);
            setTargetStatus(null);
          }}
        />
      )}
    </div>
  );
}
