import type { Account, Customer, DashboardStats, FraudAlert, Loan, SystemActivity, Transaction, TransferApproval } from "./type"


const customers: Customer[] = [
  {
    id: 'cust_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    accountType: 'checking',
    status: 'active',
    joinDate: '2022-01-15',
    totalBalance: 45250.75,
  },
  {
    id: 'cust_002',
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    phone: '(555) 234-5678',
    accountType: 'savings',
    status: 'active',
    joinDate: '2021-06-22',
    totalBalance: 120450.00,
  },
  {
    id: 'cust_003',
    name: 'Emma Rodriguez',
    email: 'emma.r@email.com',
    phone: '(555) 345-6789',
    accountType: 'credit',
    status: 'active',
    joinDate: '2023-03-10',
    totalBalance: 8750.50,
  },
  {
    id: 'cust_004',
    name: 'James Wilson',
    email: 'j.wilson@email.com',
    phone: '(555) 456-7890',
    accountType: 'checking',
    status: 'active',
    joinDate: '2020-11-05',
    totalBalance: 67890.25,
  },
  {
    id: 'cust_005',
    name: 'Lisa Anderson',
    email: 'l.anderson@email.com',
    phone: '(555) 567-8901',
    accountType: 'savings',
    status: 'suspended',
    joinDate: '2022-09-12',
    totalBalance: 32100.00,
  },
  {
    id: 'cust_006',
    name: 'Robert Taylor',
    email: 'r.taylor@email.com',
    phone: '(555) 678-9012',
    accountType: 'checking',
    status: 'active',
    joinDate: '2021-04-20',
    totalBalance: 55600.75,
  },
  {
    id: 'cust_007',
    name: 'Jennifer Brown',
    email: 'j.brown@email.com',
    phone: '(555) 789-0123',
    accountType: 'credit',
    status: 'inactive',
    joinDate: '2023-07-08',
    totalBalance: 3200.00,
  },
  {
    id: 'cust_008',
    name: 'David Martinez',
    email: 'd.martinez@email.com',
    phone: '(555) 890-1234',
    accountType: 'savings',
    status: 'active',
    joinDate: '2022-02-14',
    totalBalance: 89750.50,
  },
]

const accounts: Account[] = [
  {
    number: 'ACC001234',
    customerName: 'Sarah Johnson',
    customerId: 'cust_001',
    type: 'checking',
    balance: 45250.75,
    status: 'active',
    lastActivity: '2024-03-15',
  },
  {
    number: 'ACC001235',
    customerName: 'Michael Chen',
    customerId: 'cust_002',
    type: 'savings',
    balance: 120450.00,
    status: 'active',
    lastActivity: '2024-03-14',
  },
  {
    number: 'ACC001236',
    customerName: 'Emma Rodriguez',
    customerId: 'cust_003',
    type: 'credit',
    balance: 8750.50,
    status: 'frozen',
    lastActivity: '2024-03-10',
  },
  {
    number: 'ACC001237',
    customerName: 'James Wilson',
    customerId: 'cust_004',
    type: 'checking',
    balance: 67890.25,
    status: 'active',
    lastActivity: '2024-03-15',
  },
  {
    number: 'ACC001238',
    customerName: 'Lisa Anderson',
    customerId: 'cust_005',
    type: 'savings',
    balance: 32100.00,
    status: 'frozen',
    lastActivity: '2024-02-28',
  },
  {
    number: 'ACC001239',
    customerName: 'Robert Taylor',
    customerId: 'cust_006',
    type: 'checking',
    balance: 55600.75,
    status: 'active',
    lastActivity: '2024-03-15',
  },
]

const transactions: Transaction[] = [
  {
    id: 'txn_001',
    accountNumber: 'ACC001234',
    type: 'transfer',
    amount: 5000.00,
    date: '2024-03-15',
    status: 'completed',
    description: 'Transfer to ACC001237',
    recipientAccount: 'ACC001237',
  },
  {
    id: 'txn_002',
    accountNumber: 'ACC001235',
    type: 'deposit',
    amount: 10000.00,
    date: '2024-03-15',
    status: 'completed',
    description: 'Salary deposit',
  },
  {
    id: 'txn_003',
    accountNumber: 'ACC001236',
    type: 'withdrawal',
    amount: 500.00,
    date: '2024-03-14',
    status: 'failed',
    description: 'ATM withdrawal - account frozen',
  },
  {
    id: 'txn_004',
    accountNumber: 'ACC001237',
    type: 'payment',
    amount: 2500.00,
    date: '2024-03-14',
    status: 'completed',
    description: 'Credit card payment',
  },
  {
    id: 'txn_005',
    accountNumber: 'ACC001239',
    type: 'transfer',
    amount: 15000.00,
    date: '2024-03-13',
    status: 'pending',
    description: 'International transfer',
  },
  {
    id: 'txn_006',
    accountNumber: 'ACC001234',
    type: 'deposit',
    amount: 3500.00,
    date: '2024-03-13',
    status: 'completed',
    description: 'Freelance payment',
  },
  {
    id: 'txn_007',
    accountNumber: 'ACC001235',
    type: 'withdrawal',
    amount: 1000.00,
    date: '2024-03-12',
    status: 'completed',
    description: 'Cash withdrawal',
  },
  {
    id: 'txn_008',
    accountNumber: 'ACC001237',
    type: 'transfer',
    amount: 8500.00,
    date: '2024-03-11',
    status: 'completed',
    description: 'Investment transfer',
  },
]

const loans: Loan[] = [
]

const fraudAlerts: FraudAlert[] = [

]

const transferApprovals: TransferApproval[] = [
  {
    id: 'approval_001',
    fromAccount: 'ACC001234',
    toAccount: 'ACC001237',
    fromCustomer: 'Sarah Johnson',
    toCustomer: 'James Wilson',
    amount: 50000.00,
    date: '2024-03-15',
    status: 'pending',
    reason: 'Large wire transfer',
  },
  {
    id: 'approval_002',
    fromAccount: 'ACC001239',
    toAccount: 'External',
    fromCustomer: 'Robert Taylor',
    toCustomer: 'External Account',
    amount: 75000.00,
    date: '2024-03-15',
    status: 'pending',
    reason: 'International transfer',
  },
  {
    id: 'approval_003',
    fromAccount: 'ACC001235',
    toAccount: 'ACC001234',
    fromCustomer: 'Michael Chen',
    toCustomer: 'Sarah Johnson',
    amount: 25000.00,
    date: '2024-03-14',
    status: 'approved',
  },
]

const systemActivity: SystemActivity[] = [
  {
    id: 'activity_001',
    date: '2024-03-15',
    user: 'Admin User',
    action: 'Frozen account ACC001236',
    account: 'ACC001236',
    status: 'success',
  },
  {
    id: 'activity_002',
    date: '2024-03-15',
    user: 'Risk Officer',
    action: 'Triggered fraud alert',
    amount: 15000.00,
    account: 'ACC001236',
    status: 'success',
  },
  {
    id: 'activity_003',
    date: '2024-03-15',
    user: 'Loan Officer',
    action: 'Approved loan application',
    amount: 25000.00,
    account: 'ACC001234',
    status: 'success',
  },
  {
    id: 'activity_004',
    date: '2024-03-14',
    user: 'System',
    action: 'Batch processing - Daily reports',
    status: 'success',
  },
  {
    id: 'activity_005',
    date: '2024-03-14',
    user: 'Support Agent',
    action: 'Password reset',
    account: 'ACC001238',
    status: 'success',
  },
  {
    id: 'activity_006',
    date: '2024-03-14',
    user: 'Admin User',
    action: 'Failed login attempt',
    status: 'failed',
  },
]

// Getter functions
export function getCustomers(): Customer[] {
  return customers
}

export function getAccounts(): Account[] {
  return accounts
}

export function getTransactions(): Transaction[] {
  return transactions
}

export function getLoans(): Loan[] {
  return loans
}

export function getFraudAlerts(): FraudAlert[] {
  return fraudAlerts
}

export function getTransferApprovals(): TransferApproval[] {
  return transferApprovals
}

export function getSystemActivity(): SystemActivity[] {
  return systemActivity
}

export function getDashboardStats(): DashboardStats {
  return {
    totalCustomers: customers.filter((c) => c.status === 'active').length,
    activeAccounts: accounts.filter((a) => a.status === 'active').length,
    totalTransactions: transactions.length,
    pendingApprovals: transferApprovals.filter((a) => a.status === 'pending').length,
    totalTransactionVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    highRiskAlerts: fraudAlerts.filter((a) => a.riskLevel === 'high').length,
  }
}
