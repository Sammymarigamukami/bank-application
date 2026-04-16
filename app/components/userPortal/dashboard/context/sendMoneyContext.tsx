'use client';

import { createContext, useContext, useState } from 'react';
import { transferMoney, type TransferPayload } from '~/api/auth';


export type TransactionStatus = 'idle' | 'pending' | 'success' | 'failed';

interface SendMoneyContextType {
  showSendFormModal: boolean;
  setShowSendFormModal: (v: boolean) => void;
  showProcessingModal: boolean;
  setShowProcessingModal: (v: boolean) => void;
  transactionStatus: TransactionStatus;
  setTransactionStatus: (v: TransactionStatus) => void;
  // Updated signature to include description
  startTransaction: (data: TransferPayload) => Promise<void>;
  cancelTransaction: () => void;
}

const SendMoneyContext = createContext<SendMoneyContextType | null>(null);

export function SendMoneyProvider({ children }: { children: React.ReactNode }) {
  const [showSendFormModal, setShowSendFormModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');

  // --- START TRANSACTION (Now Async) ---
  const startTransaction = async (data: TransferPayload) => {
    // 1. Prepare UI
    setShowSendFormModal(false);
    setShowProcessingModal(true);
    setTransactionStatus('pending');

    try {
      // 2. Call the real API
      const result = await transferMoney(data);

      // 3. Handle Result
      if (result && result.success) {
        setTransactionStatus('success');
      } else {
        setTransactionStatus('failed');
      }
    } catch (error) {
      console.error("Context Transfer Error:", error);
      setTransactionStatus('failed');
    }
  };

  const cancelTransaction = () => {
    setTransactionStatus('idle');
    setShowProcessingModal(false);
  };

  return (
    <SendMoneyContext.Provider
      value={{
        showSendFormModal,
        setShowSendFormModal,
        showProcessingModal,
        setShowProcessingModal,
        transactionStatus,
        setTransactionStatus,
        startTransaction,
        cancelTransaction,
      }}
    >
      {children}
    </SendMoneyContext.Provider>
  );
}

export function useSendMoney() {
  const context = useContext(SendMoneyContext);
  if (!context) {
    throw new Error('useSendMoney must be used inside SendMoneyProvider');
  }
  return context;
}