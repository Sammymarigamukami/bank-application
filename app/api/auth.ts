
import { useEffect, useState } from "react";
import { apiClient } from "./index";
import { useNavigate } from "react-router";



// Helper to decode JWT expiration
const getTokenExpiration = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch {
    return Date.now() + 3600000; // Fallback to 1 hour if decoding fails
  }
};
const persistSession = (user: any) => {
  localStorage.setItem("token", user.token);
  localStorage.setItem("tokenExpiration", getTokenExpiration(user.token).toString());
  localStorage.setItem("role", user.role);
  localStorage.setItem("userName", user.displayName);
};
/**
 * CUSTOMER LOGIN
 */
export async function loginCustomer(credentials: any) {
  try {
    const response = await apiClient.post("/login/customer", credentials);

    if (response.data.auth !== "success") {
      throw new Error(response.data.message || "Customer login failed");
    }

    const data = response.data;
    const user = {
      token: data.token,
      role: "customer",
      userId: data.customerId,
      displayName: data.userName, // Customer API uses userName
      email: data.email,
    };

    persistSession(user);
    return user;
  } catch (error: any) {
    return Promise.reject(error.response?.data?.message || error.message || "Server Error");
  }
}

/**
 * EMPLOYEE / ADMIN LOGIN
 */
export async function loginEmployee(credentials: any) {
  try {
    const response = await apiClient.post("/login/employee", credentials);

    if (response.data.auth !== "success") {
      throw new Error(response.data.message || "Employee login failed");
    }

    const data = response.data;
    const user = {
      token: data.token,
      // Take the first role from the roles array (e.g., "employee" or "admin")
      role: data.roles?.[0] || "employee",
      userId: data.employeeId,
      displayName: data.username, // Employee API uses username (lowercase)
      branchId: data.branchId,
    };

    persistSession(user);
    return user;
  } catch (error: any) {
    return Promise.reject(error.response?.data?.message || error.message || "Server Error");
  }
}

/**
 * 
 * @param userData 
 * @returns 
 * 
 * registerCustomer function that takes user data and sends a POST request to the 
 * customer registration endpoint. If the registration is successful, it stores the JWT token, its expiration time,
 *  and the user's role in localStorage. If the registration fails, it returns a rejected promise with the error message.
 */
export async function registerCustomer(userData: any) {
  try {
    const response = await apiClient.post("/login/register/onlineAccount", userData);
    console.log("Registration response:", response.data); // Log the full response for debugging
    if (response.data.auth === "success") {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("tokenExpiration", (Date.now() + 900_000).toString());
      const primaryRole = Array.isArray(response.data.roles) ? response.data.roles[0] : response.data.roles;
      localStorage.setItem("role", primaryRole);
      return response.data;
    } else {
      return Promise.reject(response.data.message);
    }
  } catch (error: any) {
    return Promise.reject(error.message);
  }
}

export interface User  {
  id: string
  username: string
  email: string
  role: string
}
export async function isAuth(): Promise<User | null> {
  try {
    const response = await apiClient.get("/login/user-auth");
    const { user } = response.data;
    return user;
  } catch (error) {
    console.error("Auth check failed:",error );
    return null;
  }
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("role");
  return Promise.resolve("Logout Successful");
}

export function useAuthRedirect() {
  const [customer, setCustomer] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCustomer = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const expiry = localStorage.getItem("tokenExpiration");

      if (!token || role !== "customer" || Date.now() > Number(expiry)) {
        localStorage.clear();
        return;
      }

      try {
        const response = await apiClient.get("/login/user-auth");
        const user = response.data.user;
        console.log("Authenticated user data:", user); // Log the user data for debugging

        if (!user || user.role !== "customer") {
          throw new Error("Unauthorized");
        }

        setCustomer(user);
      } catch (err) {
        localStorage.clear();
      }
    };

    checkCustomer();
  }, [navigate]);

  return customer;
}


export function useEmployeeAuth() {
  const [employee, setEmployee] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmployee = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const expiry = localStorage.getItem("tokenExpiration");

      // 1. Initial Local Check
      // Block anyone who isn't an employee/admin or has an expired token
      const isStaff = role === "employee" || role === "admin" || role === "manager";
      
      if (!token || !isStaff || Date.now() > Number(expiry)) {
        console.warn("Unauthorized access attempt or session expired.");
        localStorage.clear();
        navigate("/EmployeeLogin"); // Direct redirect to Employee portal login
        return;
      }

      try {
        // 2. Server-Side Verification
        const response = await apiClient.get("/login/user-auth");
        const userData = response.data.user;

        // Ensure the server confirms they still have a staff role
        const serverRoles = Array.isArray(userData.role) ? userData.role : [userData.role];
        const hasStaffAccess = serverRoles.some((r: string) => 
          ["employee", "admin", "manager"].includes(r)
        );

        if (!userData || !hasStaffAccess) {
          throw new Error("Insufficient permissions");
        }

        setEmployee(userData);
      } catch (err) {
        console.error("Employee Auth Check Failed:", err);
        localStorage.clear();
        navigate("/EmployeeLogin");
      }
    };

    checkEmployee();
  }, [navigate]);

  return employee;
}


export interface Transaction {
  date: string;
  description: string | null;
  type: string;
  amount: string;
  status: string;
}

export async function getCustomerTransactions(customerId: string | number): Promise<Transaction[]> {
  try {
    // Inject the customerId directly into the path to match your URL structure
    const response = await apiClient.get(`/transactions/customer/${customerId}`);
    
    // Most Express/Node backends return the data inside a 'success' or 'data' property
    // Adjust based on your specific backend response structure
    return response.data.success ? response.data.data : response.data; 
  } catch (error: any) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

export interface Account {
  id: number;
  number: string;
  type: string;
  currency: string;
  balance: number;
  status: string;
}

// Update this to match your backend's new categorized structure
export interface CategorizedAccounts {
  current?: Account[];
  savings?: Account[];
  business?: Account[];
  [key: string]: Account[] | undefined;
}

export async function getAllCategorizedAccounts(customerID: number): Promise<CategorizedAccounts | null> {
  try {
    const response = await apiClient.get("/user/api/getBalance", { params: { customerID } });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all accounts:", error);
    return null;
  }
}

export async function depositViaPpesa(customerID: number, amount: number, phoneNumber: string): Promise<string> {
  try {
    const response = await apiClient.post("/user/api/deposit", { customerID, amount, phoneNumber });
    return response.data.message;
  } catch (error: any) {
    console.error("Failed to deposit via Ppesa:", error);
    return "Deposit failed";
  }
}

export async function getAdminDashboardStats() {
  try {
    const response = await apiClient.get("/admin/api/dashboard");

    console.log("Admin Dashboard Stats Response:", response.data); // Log the full response for debugging

    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error: any) {
    console.error("Failed to fetch admin dashboard stats:", error);
    return null;
  }
}

export async function getAdminAllTransactions(filters = {}) {
  try {
    const response = await apiClient.get("/transactions/admin/all", {
      params: filters // Sends type, status, fromDate, etc., as query strings
    });
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Failed to fetch admin transactions:", error);
    return [];
  }
}


export const updateCustomerStatus = async (customerId: string | number, status: 'active' | 'suspended' | 'closed') => {
  try {
    // This hits the /admin/api/customers/:id/status route we'll define next
    const response = await apiClient.patch(`/admin/api/customers/${customerId}/status`, { 
      status 
    });
    
    return response.data;
  } catch (error) {
    console.error("Failed to update status:", error);
    throw error;
  }
};


export const getCustomerFullProfile = async (customerId: string | number, filters = {}) => {
  try {
    const response = await apiClient.get(`/admin/api/customers/${customerId}`, {
      params: filters // Passes type, status, fromDate etc. to the backend
    });
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
};

export const getAllAdminCustomers = async (filters = {}) => {
  try {
    const response = await apiClient.get('/admin/api/customers', {
      params: filters // Allows filtering by status, account_type, etc.
    });
    
    // Following your existing pattern: return data if success is true
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Admin customers fetch error:", error);
    return []; // Return empty array on error to prevent mapping crashes in UI
  }
};

export interface ActiveAccountReport {
  customerId: number;
  accountNumber: string;
  holderName: string;
  type: 'savings' | 'current' | 'business';
  balance: string | number;
  status: string;
  lastActivity: string;
}

export const getActiveAccountsReport = async () => {
  try {
    const response = await apiClient.get('/admin/api/reports/active-accounts');
    
    // Returns the array from data: [...]
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Active accounts report fetch error:", error);
    return [];
  }
};


// --- INTERFACES ---

export interface DepositPayload {
  phone: string;
  amount: string | number;
  accountId: string | number;
}

export interface DepositResponse {
  success: boolean;
  message?: string;
  CheckoutRequestID?: string; // Standard Daraja API response key
  CustomerMessage?: string;
}


/**
 * Initiates an M-Pesa STK Push deposit.
 * @param data - The phone, amount, and accountId
 */
export const initiateDeposit = async (data: DepositPayload): Promise<DepositResponse | null> => {
  try {
    const response = await apiClient.post('/user/api/deposit', data);
    
    // We return the whole data object so the UI can access CheckoutRequestID
    return response.data;
  } catch (error) {
    console.error("M-Pesa deposit initiation error:", error);
    return null;
  }
};

/**
 * Checks the status of a specific M-Pesa transaction.
 * @param checkoutRequestId - The ID returned from the initiation call
 */
export const getMpesaStatus = async (checkoutRequestId: string) => {
  try {
    const response = await apiClient.get(`/user/api/deposit/status/${checkoutRequestId}`);
    return response.data;
  } catch (error) {
    console.error("M-Pesa status check error:", error);
    return { success: false, status: 'FAILED' };
  }
};

export interface TransferPayload {
  receiverAccountNumber: string;
  amount: number;
  description: string;
}

export interface TransferResponse {
  success: boolean;
  message: string;
  data: {
    referenceCode: string;
    amount: number;
    recipientAccountId: string;
    timestamp: string;
  };
}

/**
 * Initiates an internal account-to-account transfer.
 * @param data - The receiver ID, amount, and description note
 */
export const transferMoney = async (data: TransferPayload): Promise<TransferResponse | null> => {
  try {
    const response = await apiClient.post('/user/api/accounts/transfer/account', data);
    
    // Returns the success message and transaction data (referenceCode, etc.)
    return response.data;
  } catch (error) {
    console.error("Account transfer error:", error);
    // Returning null or throwing error depending on how your UI handles failures
    return null; 
  }
};


export interface CreateCardPayload {
  card_type: 'debit' | 'credit';
}

export interface CreateCardResponse {
  success: boolean;
  message: string;
  data: {
    card_id: number;
    account_id: number;
    card_number: string;
    card_type: string;
    expiry_date: string;
  };
}


export const issueNewCard = async (data: CreateCardPayload): Promise<CreateCardResponse | null> => {
  try {
    const response = await apiClient.post('/user/api/accounts/card/createCard', data);
    
    // Returns the success message and card details (number, expiry, etc.)
    return response.data;
  } catch (error: any) {
    console.error("Card issuance error:", error.response?.data || error.message);
    return null;
  }
};


export interface CardDetailsResponse {
  success: boolean;
  data: {
    card_id: number;
    account_id: number;
    card_number: string;
    card_type: string;
    expiry_date: string;
    status: 'active' | 'frozen' | 'blocked';
  };
}

export const getCardDetails = async (cardId: string | number): Promise<CardDetailsResponse | null> => {
  try {
    // We use a template literal to inject the cardId into the URL path
    const response = await apiClient.get(`/user/api/accounts/getCardDetails/${cardId}`);
    
    return response.data;
  } catch (error: any) {
    console.error("Fetch card details error:", error.response?.data || error.message);
    return null;
  }
};


export interface CardActionPayload {
  card_id: string | number;
}

export interface FreezeCardResponse {
  success: boolean;
  message: string;
  status?: 'blocked'; // Only present on success
}


export const freezeCard = async (cardId: string | number): Promise<FreezeCardResponse | null> => {
  try {
    const response = await apiClient.post('/user/api/accounts/card/freeze', {
      card_id: cardId.toString(),
    });
    
    return response.data;
  } catch (error: any) {

    if (error.response?.data) {
      return error.response.data;
    }
    
    console.error("Freeze card error:", error.message);
    return null;
  }
};

export interface UnfreezeCardResponse {
  success: boolean;
  message: string;
  status?: 'active'; // Present on success
}

/**
 * Unfreezes a previously frozen card to re-enable transactions.
 * Endpoint: POST http://localhost:8000/user/api/accounts/card/unfreeze
 * @param cardId - The unique ID of the card to unfreeze
 */
export const unfreezeCard = async (cardId: string | number): Promise<UnfreezeCardResponse | null> => {
  try {
    const response = await apiClient.post('/user/api/accounts/card/unfreeze', {
      card_id: cardId.toString(),
    });
    
    return response.data;
  } catch (error: any) {
    // Check if backend returned a structured error message
    if (error.response?.data) {
      return error.response.data;
    }
    
    console.error("Unfreeze card error:", error.message);
    return null;
  }
};

export interface Card {
  card_id: number;
  account_id: number;
  card_number: string;
  card_type: string;
  expiry_date: string;
  status: 'active' | 'frozen' | 'blocked';
  account_number: string;
}

export interface AllCardsResponse {
  success: boolean;
  data: Card[];
}

/**
 * Fetches all cards associated with the authenticated customer.
 * Endpoint: GET http://localhost:8000/user/api/accounts/card/customer/all
 */
export const getAllCustomerCards = async (): Promise<AllCardsResponse | null> => {
  try {
    const response = await apiClient.get('/user/api/accounts/card/customer/all');
    
    return response.data;
  } catch (error: any) {
    console.error("Fetch all cards error:", error.response?.data || error.message);
    return null;
  }
};

export interface DeleteCardResponse {
  success: boolean;
  message: string;
}


/**
 * Permanently removes a card from the system.
 * Endpoint: POST http://localhost:8000/user/api/accounts/card/delete/:card_id
 * @param cardId - The unique ID of the card to delete
 */
export const deleteCard = async (cardId: string | number): Promise<DeleteCardResponse | null> => {
  try {
    const response = await apiClient.delete(`/user/api/accounts/card/delete/${cardId}`);
    
    return response.data;
  } catch (error: any) {
    console.error("Delete card error:", error.response?.data || error.message);
    return null;
  }
};

export interface ActivatedAccount {
  accountId: number;
  customer_id: string;
  account_number: string;
  account_type: "business" | "savings" | "checking";
  status: "active" | "not_active";
}

export interface ActivateAccountResponse {
  success: boolean;
  message: string;
  data?: ActivatedAccount;
}

/**
 * Activates a specific account type for a customer.
 * Endpoint: PUT http://localhost:8000/admin/api/accounts/activate/business/:customerID/:accountType
 * @param customerID - The ID of the customer
 * @param accountType - The type of account to activate (e.g., 'business' or 'savings')
 */
export const activateAccountType = async (
  customerID: string | number,
  accountType: string
): Promise<ActivateAccountResponse | null> => {
  try {
    // Note: Using .put as activation is generally an update/idempotent action
    const response = await apiClient.put<ActivateAccountResponse>(
      `/admin/api/accounts/activate/business/${customerID}/${accountType}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Account activation error:", error.response?.data || error.message);
    
    // Return the error response if available, otherwise null
    return error.response?.data || { success: false, message: "Server connection failed" };
  }
};


// Add these to your existing auth.ts file

export interface AnalyticItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticItem[];
}

/**
 * Fetches spending analytics for a specific customer
 */
export const getCustomerAnalytics = async (customerId: string | number): Promise<AnalyticItem[]> => {
  try {
    const response = await apiClient.get<AnalyticsResponse>(`/transactions/customer/${customerId}/analytics`);
    return response.data.data; // Return the array inside the 'data' key
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

/**
 * Interface for Paybill Request Body
 */
export interface PaybillRequest {
  businessNumber: string;
  accountReference: string;
  amount: number;
  description?: string;
}

/**
 * Interface for the specific data returned on success
 */
export interface PaybillDetails {
  success: boolean;
  transactionId: number;
  referenceCode: string;
  amount: number;
  newBalance: number;
}

/**
 * Interface for the full API Response
 */
export interface PaybillResponse {
  success: boolean;
  message: string;
  data: PaybillDetails;
}

/**
 * Processes a paybill payment
 */
export const processPaybill = async (paymentData: PaybillRequest): Promise<PaybillResponse> => {
  try {
    const response = await apiClient.post<PaybillResponse>(
      `/user/api/accounts/paybill`, 
      paymentData
    );
    return response.data;
  } catch (error: any) {
    console.error("Paybill Error:", error);
    // Throw the error message from backend if it exists, otherwise a generic one
    throw new Error(error.response?.data?.message || "Payment failed. Please check your balance.");
  }
};

/**
 * Interface for a single Paybill History Record
 */
export interface PaybillHistoryItem {
  business_number: string;
  account_reference: string;
  amount: string; // Backend returns as string (decimal)
  reference_code: string;
  payment_date: string; // ISO Date string
  business_name: string | null;
}

/**
 * Interface for the History API Response
 */
export interface PaybillHistoryResponse {
  success: boolean;
  data: PaybillHistoryItem[];
}

/**
 * Fetches the user's paybill transaction history
 */
export const getPaybillHistory = async (): Promise<PaybillHistoryResponse> => {
  try {
    const response = await apiClient.get<PaybillHistoryResponse>(
      `/user/api/accounts/paybill/history`
    );
    return response.data;
  } catch (error: any) {
    console.error("Fetch Paybill History Error:", error);
    throw new Error(
      error.response?.data?.message || "Could not load payment history."
    );
  }
};


export interface TransferResponse {
  success: boolean;
  referenceCode: string;
  from: string;
  to: string;
  amount: number;
  newSourceBalance: number;
}

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

/**
 * Processes an internal transfer between user accounts
 */
export const processTransfer = async (payload: TransferRequest): Promise<TransferResponse> => {
  try {
    const response = await apiClient.post<TransferResponse>(
      `/user/api/transfer`,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Internal Transfer Error:", error);
    throw new Error(
      error.response?.data?.message || "Internal transfer failed. Please check your balance."
    );
  }
};

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: string;
  netWorth: number;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: string | number;
  expenses: string | number;
}

export interface BudgetGoal {
  category: string;
  budget: number;
  spent: number;
  currentBalance: number;
}

export interface AnalysisResponse {
  success: boolean;
  summary: AnalyticsSummary;
  spendingByCategory: SpendingCategory[];
  monthlyOverview: MonthlyTrend[];
  budgetGoals: BudgetGoal[];
}

/**
 * GET FULL ANALYSIS BY CUSTOMER ID
 * Fetches summary stats, spending by category, monthly trends, and budget goals.
 */
export const getAccountAnalysis = async (customerId: string | number): Promise<AnalysisResponse> => {
  try {
    const response = await apiClient.get<AnalysisResponse>(
      `/user/api/accounts/analysis/${customerId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Fetch Analytics Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to load financial analysis. Please try again later."
    );
  }
};

export interface CreateFDRequest {
  accountId: number;
  amount: number;
  durationMonths: number;
  interestRate: number;
}

export interface FDResponseData {
  fd_id: number;
  reference_code: string;
}

export interface CreateFDResponse {
  success: boolean;
  message: string;
  data: FDResponseData;
}

/**
 * CREATE FIXED DEPOSIT
 * Deducts funds from savings and creates a locked FD record.
 */
export const createFixedDeposit = async (fdData: CreateFDRequest): Promise<CreateFDResponse> => {
  try {
    const response = await apiClient.post<CreateFDResponse>(
      `/user/api/fd/create`, 
      fdData
    );
    return response.data;
  } catch (error: any) {
    console.error("Create FD Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create Fixed Deposit. Please check your balance."
    );
  }
};

export interface EligibleFD {
  fd_id: number;
  principal_amount: string; // Keep as string if coming from MySQL Decimal
  interest_rate: string;
  maturity_date: string;
}

export interface EligibleFDResponse {
  success: boolean;
  data: EligibleFD[];
}

/**
 * GET ELIGIBLE COLLATERAL
 * Fetches all active Fixed Deposits that can be used for online loans.
 */
export const getEligibleFDs = async (): Promise<EligibleFDResponse> => {
  try {
    const response = await apiClient.get<EligibleFDResponse>('/user/api/fd/eligible');
    return response.data;
  } catch (error: any) {
    console.error("Fetch Eligible FDs Error:", error);
    throw new Error(error.response?.data?.message || "Could not load collateral options.");
  }
};

export interface FDPortfolioItem {
  fd_id: number;
  customer_id: number;
  account_id: number;
  principal_amount: string;
  interest_rate: string;
  start_date: string;
  maturity_date: string;
  status: 'active' | 'matured' | 'liquidated' | 'held_as_collateral';
  created_at: string;
  source_account: string;
}

export interface FDPortfolioResponse {
  success: boolean;
  data: FDPortfolioItem[];
}

/**
 * GET FD PORTFOLIO
 * Fetches all Fixed Deposits owned by the current user.
 */
export const getMyFDPortfolio = async (): Promise<FDPortfolioResponse> => {
  try {
    const response = await apiClient.get<FDPortfolioResponse>('/user/api/fd/my-portfolio');
    return response.data;
  } catch (error: any) {
    console.error("Fetch Portfolio Error:", error);
    throw new Error(error.response?.data?.message || "Unable to load your FD portfolio.");
  }
};

/**
 * REPORT EXPORT ENDPOINTS
 */

// Since these endpoints return a file stream (Blob), we don't need a JSON interface 
// for the data, but we can define the parameters for type safety.
export interface ReportQueryParams {
  period?: 'today' | 'week' | 'month' | 'quarter' | 'custom';
  date?: string; // For daily reports (YYYY-MM-DD)
  format: 'csv' | 'pdf' | 'excel';
}

/**
 * DOWNLOAD TRANSACTION REPORT
 * Hits the administrative endpoint to fetch CSV/PDF data.
 */
export const downloadTransactionReport = async (params: ReportQueryParams): Promise<Blob> => {
  try {
    const response = await apiClient.get('/transactions/api/admin/reports/transactions', {
      params,
      responseType: 'blob', // Required to handle file downloads
      headers: {
        'Accept': params.format === 'csv' ? 'text/csv' : 'application/pdf',
      }
    });
    
    // Return the raw blob data to be processed by the UI
    return response.data as unknown as Blob;
  } catch (error: any) {
    console.error("Report Export Error:", error);
    throw new Error(error.response?.data?.message || "Unable to generate report.");
  }
};

/**
 * DOWNLOAD DAILY ADMIN REPORT
 * Specifically for the daily log endpoint.
 */
export const downloadDailyAdminReport = async (date: string, format: 'csv' | 'pdf' | 'excel'): Promise<Blob> => {
  try {
    const response = await apiClient.get('/transactions/api/admin/reports/daily', {
      params: { date, format },
      responseType: 'blob',
    });
    return response.data as unknown as Blob;
  } catch (error: any) {
    console.error("Daily Report Error:", error);
    throw new Error("Failed to download daily log.");
  }
};

/**
 * DOWNLOAD ACCOUNTS REPORT
 * Fetches all customer accounts in CSV/PDF format for administrative review.
 */
export const downloadAccountsReport = async (format: 'csv' | 'pdf' | 'excel'): Promise<Blob> => {
  try {
    const response = await apiClient.get('/admin/api/admin/reports/accounts', {
      params: { format },
      responseType: 'blob',
    });
    
    return response.data as unknown as Blob;
  } catch (error: any) {
    console.error("Accounts Report Error:", error);
    throw new Error("Unable to generate accounts report.");
  }
};

// services/loanService.ts

export interface LoanProduct {
  loan_type_id?: number;
  type_name: string;
  base_interest_rate: number ;
  max_duration_months: number;
  min_amount: number;
  max_amount: number;
  is_online: boolean | number;
  created_at?: string;
}

/**
 * 1. Create a New Loan Product
 * POST http://localhost:8000/loans/api/loans/create/types
 */
export const createLoanType = async (data: LoanProduct): Promise<any> => {
  try {
    const response = await apiClient.post('/loans/api/loans/create/types', data);
    return response.data;
  } catch (error: any) {
    console.error("Create Loan Type Error:", error);
    throw new Error(error.response?.data?.message || "Unable to create loan product.");
  }
};

/**
 * 2. Get All Loan Types
 * GET http://localhost:8000/loans/api/loans/types
 */
export const getAllLoanTypes = async (): Promise<LoanProduct[]> => {
  try {
    const response = await apiClient.get('/loans/api/loans/types');
    // Returning result.data based on your API response structure
    return response.data.data as LoanProduct[];
  } catch (error: any) {
    console.error("Fetch Loan Types Error:", error);
    throw new Error("Unable to load loan types.");
  }
};

/**
 * 3. Update Existing Loan Configuration
 * PUT http://localhost:8000/loans/api/loans/update/:id
 */
export const updateLoanType = async (id: number, data: LoanProduct): Promise<any> => {
  try {
    const response = await apiClient.put(`/loans/api/loans/update/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Update Loan Type Error:", error);
    throw new Error(error.response?.data?.message || "Unable to update loan configuration.");
  }
};

/**
 * Toggles the online visibility status of a loan product
 * PATCH http://localhost:8000/loans/api/loans/toggle-status/:id
 */
export const toggleLoanStatus = async (id: number, isOnline: boolean): Promise<any> => {
  try {
    const response = await apiClient.patch(`/loans/api/loans/toggle-status/${id}`, {
      is_online: isOnline
    });
    return response.data;
  } catch (error: any) {
    console.error("Toggle Loan Status Error:", error);
    throw new Error(error.response?.data?.message || "Unable to update status.");
  }
};

/**
 * Deletes a loan product permanently
 * DELETE http://localhost:8000/loans/api/loans/delete/:id
 */
export const deleteLoanType = async (id: number): Promise<any> => {
  try {
    const response = await apiClient.delete(`/loans/api/loans/delete/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete Loan Type Error:", error);
    throw new Error(error.response?.data?.message || "Unable to delete loan product.");
  }
};


/**
 * Interface for Online Loan Application Data
 */
export interface OnlineLoanApplication {
  loanTypeId: number;
  amount: number;
  duration: number;
  interestRate: number;
  purpose: string;
  employmentStatus: string;
  monthlyIncome: number;
  idDocument: File;      // Binary file from input
  bankStatement: File;   // Binary file from input
}

/**
 * Submits an online loan application with document uploads.
 * Uses FormData to handle the mixed text and file payload.
 */
export const applyForOnlineLoan = async (data: OnlineLoanApplication): Promise<any> => {
  try {
    const formData = new FormData();

    // Append text fields
    formData.append("loanTypeId", data.loanTypeId.toString());
    formData.append("amount", data.amount.toString());
    formData.append("duration", data.duration.toString());
    formData.append("interestRate", data.interestRate.toString());
    formData.append("purpose", data.purpose);
    formData.append("employmentStatus", data.employmentStatus);
    formData.append("monthlyIncome", data.monthlyIncome.toString());

    // Append file fields (Key names must match Multer upload.fields on backend)
    formData.append("idDocument", data.idDocument);
    formData.append("bankStatement", data.bankStatement);

    // apiClient should handle the Base URL and Authorization header automatically
    const response = await apiClient.post("/loans/api/apply/online", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Apply Online Loan Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit loan application. Please try again."
    );
  }
};

/**
 * Processes a fund withdrawal
 * POST http://localhost:8000/user/api/accounts/withdraw
 */
export const withdrawFunds = async (amount: string, description: string): Promise<any> => {
  try {
    const response = await apiClient.post("/user/api/accounts/withdraw", {
      amount,
      description,
    });
    
    // Returns the full successful response object { success, message, data }
    return response.data;
  } catch (error: any) {
    console.error("Withdrawal Error:", error);
    
    // Extract the specific error message from the backend
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      "Unable to process withdrawal. Please try again.";
      
    throw new Error(errorMessage);
  }
};