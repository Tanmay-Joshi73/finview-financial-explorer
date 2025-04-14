
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Activity, BarChart, TrendingUp, Building } from "lucide-react";
import { toast } from "sonner";
import FinancialSummary from "@/components/FinancialSummary";
import ExpenseDonutChart from "@/components/charts/ExpenseDonutChart";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import SpendingLineChart from "@/components/charts/SpendingLineChart";
import TopVendors from "@/components/TopVendors";
import { api } from "@/services/api";
import { DashboardData, Transaction } from "@/types";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import VendorDetails from "@/components/VendorDetails";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthTransactions, setMonthTransactions] = useState<Transaction[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

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

  const handleVendorSelect = (vendor: string) => {
    setSelectedVendor(vendor);
    setActiveSection("topVendors");
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

  const renderContent = () => {
    switch (activeSection) {
      case "predictAI":
        return (
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">AI Predictions</h2>
            <p className="text-gray-600 mb-6">Coming soon! Our AI will analyze your spending patterns and predict future expenses.</p>
          </div>
        );
      case "topExpenses":
        return (
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Top Expenses</h2>
            <ExpenseDonutChart data={dashboardData.summary.categoryBreakdown} />
          </div>
        );
      case "investmentOptions":
        return (
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Investment Options</h2>
            <p className="text-gray-600 mb-6">Based on your spending patterns, here are some investment recommendations (coming soon).</p>
          </div>
        );
      case "topVendors":
        return selectedVendor ? (
          <VendorDetails 
            vendorName={selectedVendor} 
            transactions={dashboardData.transactions}
            onBack={() => setSelectedVendor(null)}
          />
        ) : (
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Top Vendors</h2>
            <div className="space-y-4">
              {dashboardData.summary.topVendors.map((vendor) => (
                <div 
                  key={vendor.vendor} 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedVendor(vendor.vendor)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{vendor.vendor}</span>
                    <span className="text-blue-600">₹{vendor.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500">{vendor.transactionCount} transactions</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <>
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
                <TopVendors 
                  summary={dashboardData.summary} 
                  onVendorSelect={handleVendorSelect}
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar side="left" variant="floating" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center px-2 py-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">FinView</h3>
                <p className="text-xs text-gray-500">Financial Dashboard</p>
              </div>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("dashboard")}
                      isActive={activeSection === "dashboard"}
                      tooltip="Dashboard"
                    >
                      <BarChart className="mr-2" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("predictAI")}
                      isActive={activeSection === "predictAI"}
                      tooltip="Predict with AI"
                    >
                      <Activity className="mr-2" />
                      <span>Predict with AI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("topExpenses")}
                      isActive={activeSection === "topExpenses"}
                      tooltip="Top Expenses"
                    >
                      <TrendingUp className="mr-2" />
                      <span>Top Expenses</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("investmentOptions")}
                      isActive={activeSection === "investmentOptions"}
                      tooltip="Investment Options"
                    >
                      <BarChart className="mr-2" />
                      <span>Investment Options</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("topVendors")}
                      isActive={activeSection === "topVendors"}
                      tooltip="Top Vendors"
                    >
                      <Building className="mr-2" />
                      <span>Top Vendors</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="p-6">
          <div className="container mx-auto py-4">
            <div className="mb-8">
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
            
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
