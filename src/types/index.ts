
export interface Vendor {
  name: string;
  time: string;
}

export interface Transaction {
  _id: string;
  month: string;
  Date: string;
  Paid_To_Who: Vendor;
  Amount: string;
  Weekend: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySpending {
  month: string;
  totalSpent: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface SpendingSummary {
  totalSpent: number;
  biggestExpense: {
    amount: number;
    vendor: string;
    date: string;
  };
  topMonthBySpending: {
    month: string;
    amount: number;
  };
  topVendors: {
    vendor: string;
    totalSpent: number;
    transactionCount: number;
  }[];
  categoryBreakdown: CategorySpending[];
  monthlyBreakdown: MonthlySpending[];
}

export interface DashboardData {
  transactions: Transaction[];
  summary: SpendingSummary;
}
