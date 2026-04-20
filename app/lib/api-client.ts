
import { MOCK_LOANS, MOCK_CUSTOMER_ACCOUNTS } from './mock-data';
import type { CustomerAccount, Loan, LoanStatus } from './type';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchAllLoans(): Promise<Loan[]> {
  await delay(500);
  return MOCK_LOANS;
}

export async function fetchLoanById(id: number): Promise<Loan | null> {
  await delay(300);
  return MOCK_LOANS.find(loan => loan.loan_id === id) || null;
}

export async function fetchCustomerAccounts(customerId: number): Promise<CustomerAccount[]> {
  await delay(400);
  return MOCK_CUSTOMER_ACCOUNTS[customerId] || [];
}

export async function updateLoanStatus(loanId: number, newStatus: LoanStatus): Promise<Loan | null> {
  await delay(600);
  const loan = MOCK_LOANS.find(l => l.loan_id === loanId);
  if (loan) {
    loan.status = newStatus;
    return loan;
  }
  return null;
}

export async function searchLoans(query: string): Promise<Loan[]> {
  await delay(300);
  const lowerQuery = query.toLowerCase();
  return MOCK_LOANS.filter(
    loan =>
      loan.customer_name.toLowerCase().includes(lowerQuery) ||
      loan.customer_email.toLowerCase().includes(lowerQuery) ||
      loan.loan_id.toString().includes(lowerQuery)
  );
}

export async function filterLoansByStatus(status: LoanStatus): Promise<Loan[]> {
  await delay(300);
  return MOCK_LOANS.filter(loan => loan.status === status);
}
