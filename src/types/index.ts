export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type ArrangementType =
  | "standard"
  | "payment_plan"
  | "deferment"
  | "forbearance"
  | "settlement"
  | "consolidated";

export interface Debt {
  id: string;
  userId: string;
  name: string;
  totalAmount: number;
  amountOwed: number;
  urgency: UrgencyLevel;
  arrangementType: ArrangementType;
  minimumPayment: number;
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Allocation {
  debtId: string;
  debtName: string;
  amount: number;
  type: "minimum" | "extra" | "snowball" | "avalanche";
}

export interface AllocationResult {
  totalIncome: number;
  totalExpenses: number;
  totalMinimumPayments: number;
  remainingAfterMinimums: number;
  allocations: Allocation[];
  personalSpending: number;
  savings: number;
}

export interface IncomeEntry {
  id: string;
  source: string;
  amount: number;
  date: string;
  isRecurring: boolean;
}

export interface ExpenseEntry {
  id: string;
  category: string;
  amount: number;
  date: string;
  isRecurring: boolean;
}
