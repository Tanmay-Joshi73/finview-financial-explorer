
import axios from "axios";
import { Transaction, DashboardData } from "@/types";

// For demonstration purposes, we'll create mock data
// In a real app, this would make actual API calls to your backend

const API_BASE_URL = "https://api.example.com";

// Mock data generator
const generateMockData = (): DashboardData => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const vendors = [
    "Coffee Shop", "Grocery Store", "Restaurant", "Clothing Store", 
    "Online Shop", "Gas Station", "Electronics Store", "Pharmacy",
    "Utility Company", "Streaming Service", "Gym"
  ];
  const categories = ["Food", "Shopping", "Transport", "Entertainment", "Utilities", "Healthcare"];
  
  // Generate random transactions
  const transactions: Transaction[] = Array.from({ length: 50 }, (_, i) => {
    const month = months[Math.floor(Math.random() * months.length)];
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const amount = (Math.random() * 200 + 5).toFixed(2);
    const date = new Date();
    date.setMonth(months.indexOf(month));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    
    return {
      _id: `tx${i}`,
      month,
      Date: date.toISOString(),
      Paid_To_Who: {
        name: vendor,
        time: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`
      },
      Amount: amount,
      Weekend: [0, 6].includes(date.getDay()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
  
  // Calculate summary data
  const totalSpent = transactions.reduce((sum, tx) => sum + parseFloat(tx.Amount), 0);
  
  // Find biggest expense
  const sortedByAmount = [...transactions].sort((a, b) => parseFloat(b.Amount) - parseFloat(a.Amount));
  const biggestExpense = {
    amount: parseFloat(sortedByAmount[0].Amount),
    vendor: sortedByAmount[0].Paid_To_Who.name,
    date: new Date(sortedByAmount[0].Date).toLocaleDateString()
  };
  
  // Calculate top month
  const spendingByMonth = months.map(month => {
    const monthTransactions = transactions.filter(tx => tx.month === month);
    const total = monthTransactions.reduce((sum, tx) => sum + parseFloat(tx.Amount), 0);
    return { month, totalSpent: total };
  });
  
  const topMonth = [...spendingByMonth].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  
  // Calculate top vendors
  const vendorMap = new Map<string, { totalSpent: number, transactionCount: number }>();
  transactions.forEach(tx => {
    const vendor = tx.Paid_To_Who.name;
    if (!vendorMap.has(vendor)) {
      vendorMap.set(vendor, { totalSpent: 0, transactionCount: 0 });
    }
    const current = vendorMap.get(vendor)!;
    vendorMap.set(vendor, {
      totalSpent: current.totalSpent + parseFloat(tx.Amount),
      transactionCount: current.transactionCount + 1
    });
  });
  
  const topVendors = Array.from(vendorMap.entries())
    .map(([vendor, data]) => ({
      vendor,
      totalSpent: data.totalSpent,
      transactionCount: data.transactionCount
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);
  
  // Generate category breakdown
  const categoryBreakdown = categories.map(category => ({
    category,
    amount: Math.random() * totalSpent * 0.3
  }));
  
  return {
    transactions,
    summary: {
      totalSpent,
      biggestExpense,
      topMonthBySpending: {
        month: topMonth.month,
        amount: topMonth.totalSpent
      },
      topVendors,
      categoryBreakdown,
      monthlyBreakdown: spendingByMonth
    }
  };
};

// Mock API service
export const api = {
  uploadBankStatement: async (file: File): Promise<DashboardData> => {
    // In a real app, you would upload the file to your backend
    console.log("Uploading file:", file.name);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data
    return generateMockData();
  },
  
  getMonthlyData: async (month: string): Promise<Transaction[]> => {
    // In a real app, you would fetch this from your backend
    console.log("Fetching data for month:", month);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return filtered mock data
    const allData = generateMockData();
    return allData.transactions.filter(tx => tx.month === month);
  },
  
  getDashboardData: async (): Promise<DashboardData> => {
    // In a real app, you would fetch this from your backend
    console.log("Fetching dashboard data");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return generateMockData();
  }
};
