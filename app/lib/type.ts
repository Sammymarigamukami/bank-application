export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'disbursed' | 'active' | 'closed' | 'defaulted';

export interface Loan {
  loan_id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  loan_type: string;
  amount: string;
  duration_months: number;
  interest_rate: string;
  purpose: string;
  status: LoanStatus;
  employment_status: string;
  monthly_income: string;
  id_doc_url: string;
  bank_stmt_url: string;
  created_at: string;
}

export interface CustomerAccount {
  account_id: string;
  account_type: 'Business Account' | 'Current Account' | 'Savings Account' | 'Fixed Deposit Account';
  account_number: string;
  balance: string;
  status: 'active' | 'inactive';
}

export interface StatusColor {
  badge: string;
  text: string;
  bg: string;
}

export const STATUS_COLORS: Record<LoanStatus, StatusColor> = {
  pending: {
    badge: 'bg-yellow-100 text-yellow-800',
    text: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  approved: {
    badge: 'bg-blue-100 text-blue-800',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  rejected: {
    badge: 'bg-red-100 text-red-800',
    text: 'text-red-600',
    bg: 'bg-red-50',
  },
  disbursed: {
    badge: 'bg-purple-100 text-purple-800',
    text: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  active: {
    badge: 'bg-green-100 text-green-800',
    text: 'text-green-600',
    bg: 'bg-green-50',
  },
  closed: {
    badge: 'bg-gray-100 text-gray-800',
    text: 'text-gray-600',
    bg: 'bg-gray-50',
  },
  defaulted: {
    badge: 'bg-black text-white',
    text: 'text-black',
    bg: 'bg-black/5',
  },
};
