import { mockCustomer, mockTransactions, type Customer, type Transaction } from './mock-data';

// Simulated API client with mock data
export const apiClient = {
  async getCustomer(customerId: string): Promise<Customer> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockCustomer;
  },

  async getTransactions(customerId: string): Promise<Transaction[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockTransactions;
  },

  async updateCustomerStatus(customerId: string, status: 'active' | 'suspended'): Promise<Customer> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockCustomer, status };
  },
};
