
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FinancialSummary from "@/components/FinancialSummary";
import ExpenseDonutChart from "@/components/charts/ExpenseDonutChart";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import SpendingLineChart from "@/components/charts/SpendingLineChart";
import TopVendors from "@/components/TopVendors";
import { api } from "@/services/api";
import { DashboardData, Transaction } from "@/types";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthTransactions, setMonthTransactions] = useState<Transaction[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if data was passed from upload page
    const locState = location.state as { dashboardData?: DashboardData };

    if (locState?.dashboardData) {
      setDashboardData(locState.dashboardData);
      setLoading(false);
    } else {
      // If no data is passed, fetch from API
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const data = await api.getDashboardData();
          setDashboardData(data);
          
          // Set initial selected month to the top month
          if (data.summary.topMonthBySpending) {
            handleMonthSelect(data.summary.topMonthBySpending.month);
          }
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
          toast.error("Failed to load financial data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [location]);

  const handleMonthSelect = async (month: string) => {
    if (month === selectedMonth) return;
    
    try {
      setMonthLoading(true);
      setSelectedMonth(month);
      const transactions = await api.getMonthlyData(month);
      setMonthTransactions(transactions);
    } catch (error) {
      console.error(`Failed to fetch data for ${month}:`, error);
      toast.error(`Could not load data for ${month}`);
    } finally {
      setMonthLoading(false);
    }
  };

  const handleBackToUpload = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-finance-blue mb-4" />
        <h2 className="text-xl font-medium mb-2">Loading Your Financial Dashboard...</h2>
        <p className="text-gray-500">We're crunching your numbers</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-medium mb-4">No financial data available</h2>
        <Button onClick={handleBackToUpload}>Upload a Bank Statement</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2" 
            onClick={handleBackToUpload}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Upload
          </Button>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        </div>
      </div>

      <FinancialSummary summary={dashboardData.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <MonthlyBarChart 
            data={dashboardData.summary.monthlyBreakdown} 
            onMonthSelect={handleMonthSelect}
            selectedMonth={selectedMonth || undefined}
          />
        </div>
        <div>
          <ExpenseDonutChart data={dashboardData.summary.categoryBreakdown} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-md border border-gray-100">
          {monthLoading ? (
            <div className="h-72 w-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-finance-blue" />
            </div>
          ) : selectedMonth && monthTransactions.length > 0 ? (
            <SpendingLineChart 
              transactions={monthTransactions} 
              month={selectedMonth} 
            />
          ) : (
            <div className="h-72 w-full flex flex-col items-center justify-center text-gray-500">
              <p>Select a month from the chart above to see daily spending</p>
            </div>
          )}
        </div>
        <div>
          <TopVendors summary={dashboardData.summary} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
