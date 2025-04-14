
import { IndianRupee, CreditCard, Calendar, TrendingUp } from "lucide-react";
import ExpenseCard from "@/components/ExpenseCard";
import { SpendingSummary } from "@/types";

interface FinancialSummaryProps {
  summary: SpendingSummary;
}

const FinancialSummary = ({ summary }: FinancialSummaryProps) => {
  // Format amount in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
      <ExpenseCard
        title="Total Money Spent"
        value={formatCurrency(summary.totalSpent)}
        icon={<IndianRupee className="h-6 w-6" />}
        color="blue"
      />
      
      <ExpenseCard
        title="Biggest Single Expense"
        value={formatCurrency(summary.biggestExpense.amount)}
        icon={<CreditCard className="h-6 w-6" />}
        color="red"
      />
      
      <ExpenseCard
        title="Most Expensive Month"
        value={summary.topMonthBySpending.month}
        icon={<Calendar className="h-6 w-6" />}
        color="yellow"
        trend={{ 
          value: 15, // This would be calculated in a real app
          isPositive: true
        }}
      />
      
      <ExpenseCard
        title="Top Spending Category"
        // In a real app, we'd sort the categories
        value={summary.categoryBreakdown[0]?.category || "N/A"}
        icon={<TrendingUp className="h-6 w-6" />}
        color="green"
      />
    </div>
  );
};

export default FinancialSummary;
