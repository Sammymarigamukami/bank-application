import type { LoanStatus } from "./type";


const ALLOWED_TRANSITIONS: Record<LoanStatus, LoanStatus[]> = {
  pending: ['approved', 'rejected'],
  approved: ['disbursed'],
  rejected: [],
  disbursed: ['active'],
  active: ['closed', 'defaulted'],
  closed: [],
  defaulted: [],
};

export function canTransitionTo(currentStatus: LoanStatus, targetStatus: LoanStatus): boolean {
  return ALLOWED_TRANSITIONS[currentStatus].includes(targetStatus);
}

export function getAvailableTransitions(currentStatus: LoanStatus): LoanStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus];
}

export function getTransitionLabel(targetStatus: LoanStatus): string {
  const labels: Record<LoanStatus, string> = {
    pending: 'Pending',
    approved: 'Approve',
    rejected: 'Reject',
    disbursed: 'Disburse',
    active: 'Activate',
    closed: 'Close',
    defaulted: 'Mark as Defaulted',
  };
  return labels[targetStatus];
}

export const STATUS_DISPLAY_NAMES: Record<LoanStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
  active: 'Active',
  closed: 'Closed',
  defaulted: 'Defaulted',
};