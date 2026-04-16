'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type TransactionStatus = 'idle' | 'pending' | 'success' | 'failed';

interface RequestMoneyContextType {
  showRequestFormModal: boolean;
  setShowRequestFormModal: (v: boolean) => void;

  showProcessingModal: boolean;
  setShowProcessingModal: (v: boolean) => void;

  transactionStatus: TransactionStatus;
  setTransactionStatus: (v: TransactionStatus) => void;

  startTransaction: (data: {
    accountNumber: string;
    amount: string;
    note?: string;
  }) => void;

  cancelTransaction: () => void;
}

const RequestMoneyContext = createContext<RequestMoneyContextType | null>(null);

export function RequestMoneyProvider({ children }: { children: React.ReactNode }) {
  const [showRequestFormModal, setShowRequestFormModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');

  // simulate processing (replace later with real API)
  useEffect(() => {
    if (transactionStatus !== 'pending') return;

    const timer = setTimeout(() => {
      const success = Math.random() < 0.75;
      setTransactionStatus(success ? 'success' : 'failed');
    }, 5000);

    return () => clearTimeout(timer);
  }, [transactionStatus]);

  const startTransaction = () => {
    setShowRequestFormModal(false);
    setShowProcessingModal(true);
    setTransactionStatus('pending');
  };

  const cancelTransaction = () => {
    setTransactionStatus('idle');
    setShowProcessingModal(false);
  };

  return (
    <RequestMoneyContext.Provider
      value={{
        showRequestFormModal,
        setShowRequestFormModal,
        showProcessingModal,
        setShowProcessingModal,
        transactionStatus,
        setTransactionStatus,
        startTransaction,
        cancelTransaction,
      }}
    >
      {children}
    </RequestMoneyContext.Provider>
  );
}

export function useRequestMoney() {
  const ctx = useContext(RequestMoneyContext);
  if (!ctx) throw new Error('useRequestMoney must be used inside RequestMoneyProvider');
  return ctx;
}