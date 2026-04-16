'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { processPaybill, type PaybillRequest } from '~/api/auth';
import { toast } from 'sonner';

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'failed';

interface PaybillContextType {
  // UI States
  showFormModalPaybill: boolean;
  setShowFormModalPaybill: (v: boolean) => void;
  showProcessingModal: boolean;
  setShowProcessingModal: (v: boolean) => void;
  
  // Category State (for icons/colors in the modal)
  selectedCategory: any | null;
  setSelectedCategory: (v: any | null) => void;

  // Transaction States
  transactionStatus: TransactionStatus;
  transactionData: PaybillRequest | null;

  // Actions
  startTransaction: (data: PaybillRequest) => Promise<void>;
  cancelTransaction: () => void;
}

const PaybillContext = createContext<PaybillContextType | null>(null);

export function PaybillProvider({ children }: { children: ReactNode }) {
  const [showFormModalPaybill, setShowFormModalPaybill] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
  const [transactionData, setTransactionData] = useState<PaybillRequest | null>(null);

  /**
   * Triggers the real API call
   */
  const startTransaction = async (data: PaybillRequest) => {
    setTransactionData(data);
    setShowFormModalPaybill(false); // Close input form
    setShowProcessingModal(true);  // Show loader/processing UI
    setTransactionStatus('pending');

    try {
      const response = await processPaybill(data);
      
      if (response.success) {
        setTransactionStatus('success');
        toast.success(`Payment confirmed! Ref: ${response.data.referenceCode}`);
      } else {
        setTransactionStatus('failed');
      }
    } catch (error: any) {
      console.error("Transaction API Error:", error);
      setTransactionStatus('failed');
      toast.error(error.message || "Transaction failed");
    }
  };

  /**
   * Resets the context to initial state
   */
  const cancelTransaction = () => {
    setTransactionStatus('idle');
    setShowProcessingModal(false);
    setTransactionData(null);
    // Note: We don't necessarily reset selectedCategory here 
    // so the modal keeps its icon during the "failed" state view
  };

  return (
    <PaybillContext.Provider
      value={{
        showFormModalPaybill,
        setShowFormModalPaybill,
        showProcessingModal,
        setShowProcessingModal,
        selectedCategory,
        setSelectedCategory,
        transactionStatus,
        transactionData,
        startTransaction,
        cancelTransaction,
      }}
    >
      {children}
    </PaybillContext.Provider>
  );
}

export function usePaybill() {
  const context = useContext(PaybillContext);
  if (!context) {
    throw new Error('usePaybill must be used inside PaybillProvider');
  }
  return context;
}