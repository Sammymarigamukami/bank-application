'use client';

import { createContext, useContext, useState } from 'react';

type TransactionStatus = 'idle' | 'pending' | 'success' | 'failed';

interface DepositContextType {
  showDepositModal: boolean;
  setShowDepositModal: (v: boolean) => void;

  showMpesaProcessing: boolean;
  setShowMpesaProcessing: (v: boolean) => void;

  amount: string;
  setAmount: (v: string) => void;

  transactionStatus: TransactionStatus;
  setTransactionStatus: (v: TransactionStatus) => void;
}

const DepositContext = createContext<DepositContextType | null>(null);

export function DepositProvider({ children }: { children: React.ReactNode }) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  console.log("DepositProvider rendered, showDepositModal:", showDepositModal);
  const [showMpesaProcessing, setShowMpesaProcessing] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');

  return (
    <DepositContext.Provider
      value={{
        showDepositModal,
        setShowDepositModal,
        showMpesaProcessing,
        setShowMpesaProcessing,
        amount,
        setAmount,
        transactionStatus,
        setTransactionStatus,
      }}
    >
      {children}
    </DepositContext.Provider>
  );
}

export function useDeposit() {
  const context = useContext(DepositContext);
  if (!context) throw new Error('useDeposit must be used inside DepositProvider');
  return context;
}