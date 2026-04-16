// Customer types
export type CustomerStatus = 'active' | 'inactive' | 'suspended'
export type AccountType = 'checking' | 'savings' | 'credit'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  accountType: AccountType
  status: CustomerStatus
  joinDate: string
  totalBalance: number
}

// Account types
export type AccountStatus = 'active' | 'frozen' | 'closed'

export interface Account {
  number: string
  customerName: string
  customerId: string
  type: AccountType
  balance: number
  status: AccountStatus
  lastActivity: string
}

// Transaction types
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment'
export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  accountNumber: string
  type: TransactionType
  amount: number
  date: string
  status: TransactionStatus
  description: string
  recipientAccount?: string
}

// Loan types
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed'
export type LoanType = 'personal' | 'home' | 'auto' | 'business'

export interface Loan {
  id: string
  customerId: string
  customerName: string
  type: LoanType
  amountRequested: number
  amountApproved?: number
  duration: number
  interestRate?: number
  status: LoanStatus
  applicationDate: string
}

// Fraud Alert types
export type FraudRiskLevel = 'high' | 'medium' | 'low'
export type FraudAlertType = 'unusual_transaction' | 'multiple_failed_logins' | 'geographic_anomaly' | 'velocity_check'

export interface FraudAlert {
  id: string
  accountNumber: string
  customerName: string
  type: FraudAlertType
  riskLevel: FraudRiskLevel
  amount?: number
  date: string
  description: string
}

// Transfer Approval types
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface TransferApproval {
  id: string
  fromAccount: string
  toAccount: string
  fromCustomer: string
  toCustomer: string
  amount: number
  date: string
  status: ApprovalStatus
  reason?: string
}

// System Activity types
export interface SystemActivity {
  id: string
  date: string
  user: string
  action: string
  account?: string
  amount?: number
  status: 'success' | 'failed'
}

// Dashboard Stats
export interface DashboardStats {
  totalCustomers: number
  activeAccounts: number
  totalTransactions: number
  pendingApprovals: number
  totalTransactionVolume: number
  highRiskAlerts: number
}

export interface LoanProduct {
  loan_type_id: number
  type_name: string
  base_interest_rate: number
  max_duration_months: number
  min_amount: number
  max_amount: number
  is_online: boolean
}