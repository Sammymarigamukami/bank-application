'use client';

import { createContext, useContext, useState } from 'react';
import { withdrawFunds } from '~/api/auth'; // Ensure this path matches your API file

type TransactionStatus = 'idle' | 'pending' | 'success' | 'failed';

interface WithdrawalContextType {
  showWithdrawModal: boolean;
  setShowWithdrawModal: (v: boolean) => void;
  showProcessingModal: boolean;
  transactionStatus: TransactionStatus;
  errorMessage: string | null;
  startWithdrawal: (data: { amount: string; description: string }) => Promise<void>;
  closeAllModals: () => void;
}

const WithdrawalContext = createContext<WithdrawalContextType | null>(null);

export function WithdrawalProvider({ children }: { children: React.ReactNode }) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startWithdrawal = async (data: { amount: string; description: string }) => {
    setShowWithdrawModal(false);
    setShowProcessingModal(true);
    setTransactionStatus('pending');
    setErrorMessage(null);

    try {
      const response = await withdrawFunds(data.amount, data.description);
      if (response.success) {
        setTransactionStatus('success');
      } else {
        throw new Error(response.message || "Withdrawal failed");
      }
    } catch (error: any) {
      setTransactionStatus('failed');
      setErrorMessage(error.message || "An unexpected error occurred");
    }
  };

  const closeAllModals = () => {
    setTransactionStatus('idle');
    setShowProcessingModal(false);
    setShowWithdrawModal(false);
    setErrorMessage(null);
  };

  return (
    <WithdrawalContext.Provider
      value={{
        showWithdrawModal,
        setShowWithdrawModal,
        showProcessingModal,
        transactionStatus,
        errorMessage,
        startWithdrawal,
        closeAllModals,
      }}
    >
      {children}
    </WithdrawalContext.Provider>
  );
}

export function useWithdrawal() {
  const ctx = useContext(WithdrawalContext);
  if (!ctx) throw new Error('useWithdrawal must be used inside WithdrawalProvider');
  return ctx;
}