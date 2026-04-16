export const userData = {
  name: "Null",
  email: "null@email.com",
  avatar: "/avatars/user.jpg",
}

export const accounts = [
  {
    id: "1",
    name: "Checking Account",
    type: "checking",
    number: "****4521",
    balance: 12450.0,
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings",
    number: "****7832",
    balance: 45230.5,
  },
  {
    id: "3",
    name: "Business Account",
    type: "business",
    number: "****9156",
    balance: 89120.75,
  },
]

export const transactions = [
  {
    id: "1",
    date: "Mar 12, 2026",
    description: "Amazon Purchase",
    category: "Shopping",
    amount: -8956.99,
    status: "completed",
  },
  {
    id: "2",
    date: "Mar 11, 2026",
    description: "Salary Deposit",
    category: "Income",
    amount: 5200.0,
    status: "completed",
  },
  {
    id: "3",
    date: "Mar 10, 2026",
    description: "Electricity Bill",
    category: "Utilities",
    amount: -124.5,
    status: "completed",
  },
  {
    id: "4",
    date: "Mar 9, 2026",
    description: "Transfer to Savings",
    category: "Transfer",
    amount: -50043.0,
    status: "completed",
  },
  {
    id: "5",
    date: "Mar 8, 2026",
    description: "Uber Ride",
    category: "Transport",
    amount: -2334.45,
    status: "completed",
  },
  {
    id: "6",
    date: "Mar 7, 2026",
    description: "Grocery Store",
    category: "Food",
    amount: -1563.78,
    status: "pending",
  },
]

export const cardData = {
  type: "Visa Debit",
  number: "4521 **** **** 7832",
  holder: "Null",
  expiry: "09/28",
  cvv: "***",
}

export const analytics = [
  { category: "Food", amount: 450, color: "bg-chart-1", percentage: 30 },
  { category: "Transport", amount: 180, color: "bg-chart-2", percentage: 12 },
  { category: "Shopping", amount: 620, color: "bg-chart-3", percentage: 41 },
  { category: "Utilities", amount: 250, color: "bg-chart-4", percentage: 17 },
]

export const savingsGoals = [
  {
    id: "1",
    name: "Vacation Fund",
    saved: 1200,
    target: 3000,
    icon: "plane",
  },
  {
    id: "2",
    name: "New Car",
    saved: 8500,
    target: 25000,
    icon: "car",
  },
  {
    id: "3",
    name: "Emergency Fund",
    saved: 4200,
    target: 10000,
    icon: "shield",
  },
]

export const monthlyStats = {
  income: 6450.0,
  expenses: 2340.78,
}


// Mock customer and transaction data
export interface Customer {
  id: string;
  name: string;
  customerId: string;
  accountNumber: string;
  joinedDate: string;
  status: 'active' | 'suspended';
  email: string;
  phone: string;
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  linkedAccounts?: LinkedAccount[];
}

export interface LinkedAccount {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'm-pesa';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export const mockCustomer: Customer = {
  id: '12345',
  name: 'Robert Johnson',
  customerId: 'CUST-2023-001',
  accountNumber: '1234567890',
  joinedDate: '2020-03-15',
  status: 'active',
  email: 'robert.johnson@example.com',
  phone: '+254712345678',
  totalBalance: 450000,
  totalDeposits: 1250000,
  totalWithdrawals: 800000,
  transactionCount: 156,
  linkedAccounts: [
    {
      id: 'acc-1',
      accountNumber: '0987654321',
      accountType: 'Savings',
      balance: 250000,
    },
    {
      id: 'acc-2',
      accountNumber: '1111222233',
      accountType: 'Business',
      balance: 750000,
    },
  ],
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-28',
    type: 'm-pesa',
    description: 'M-Pesa: 254712345678',
    amount: 50000,
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-03-27',
    type: 'withdrawal',
    description: 'ATM Withdrawal - Nairobi Branch',
    amount: -25000,
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-03-26',
    type: 'deposit',
    description: 'Salary Deposit - Monthly',
    amount: 150000,
    status: 'completed',
  },
  {
    id: '4',
    date: '2024-03-25',
    type: 'transfer',
    description: 'Transfer to Jane Smith - Account 0987654321',
    amount: -75000,
    status: 'completed',
  },
  {
    id: '5',
    date: '2024-03-24',
    type: 'm-pesa',
    description: 'M-Pesa: 254798765432',
    amount: 30000,
    status: 'completed',
  },
  {
    id: '6',
    date: '2024-03-23',
    type: 'withdrawal',
    description: 'ATM Withdrawal - Westgate Branch',
    amount: -40000,
    status: 'pending',
  },
  {
    id: '7',
    date: '2024-03-22',
    type: 'deposit',
    description: 'Check Deposit',
    amount: 100000,
    status: 'completed',
  },
  {
    id: '8',
    date: '2024-03-21',
    type: 'transfer',
    description: 'Transfer from Michael Brown - Account 5555666677',
    amount: 120000,
    status: 'failed',
  },
  {
    id: '9',
    date: '2024-03-20',
    type: 'withdrawal',
    description: 'Bill Payment - Electricity',
    amount: -15000,
    status: 'completed',
  },
  {
    id: '10',
    date: '2024-03-19',
    type: 'm-pesa',
    description: 'M-Pesa: 254723456789',
    amount: 25000,
    status: 'completed',
  },
];
