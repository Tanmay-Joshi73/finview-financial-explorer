
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, IndianRupee, Clock, Calendar } from 'lucide-react';
import { Transaction } from '@/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, LineChart } from 'recharts';

interface VendorDetailsProps {
  vendorName: string;
  transactions: Transaction[];
  onBack: () => void;
}

const VendorDetails = ({ vendorName, transactions, onBack }: VendorDetailsProps) => {
  // Format currency in Indian Rupees
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const vendorTransactions = useMemo(() => {
    return transactions.filter(tx => 
      tx.Paid_To_Who?.name.toLowerCase() === vendorName.toLowerCase()
    );
  }, [transactions, vendorName]);

  // Extract relevant statistics
  const totalSpent = useMemo(() => {
    return vendorTransactions.reduce((sum, tx) => 
      sum + parseFloat(tx.Amount), 0
    );
  }, [vendorTransactions]);

  const avgTransaction = totalSpent / vendorTransactions.length || 0;

  // Group transactions by month
  const transactionsByMonth = useMemo(() => {
    const monthMap = new Map<string, { count: number, amount: number }>();
    
    vendorTransactions.forEach(tx => {
      if (!monthMap.has(tx.month)) {
        monthMap.set(tx.month, { count: 0, amount: 0 });
      }
      const data = monthMap.get(tx.month)!;
      monthMap.set(tx.month, {
        count: data.count + 1,
        amount: data.amount + parseFloat(tx.Amount)
      });
    });
    
    // Convert to array for charts
    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      count: data.count,
      amount: data.amount
    })).sort((a, b) => {
      // Sort by month name
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  }, [vendorTransactions]);

  // Group transactions by time of day
  const transactionsByTime = useMemo(() => {
    const timeMap = {
      "Morning (6-10 AM)": { count: 0, amount: 0 },
      "Afternoon (11-3 PM)": { count: 0, amount: 0 },
      "Evening (4-8 PM)": { count: 0, amount: 0 },
      "Night (9 PM-5 AM)": { count: 0, amount: 0 }
    };
    
    vendorTransactions.forEach(tx => {
      // Extract hour from time (format: "08:54 AM")
      const timeStr = tx.Paid_To_Who?.time || "";
      const [hourMin, period] = timeStr.split(" ");
      
      if (!hourMin) return;
      
      let hour = parseInt(hourMin.split(":")[0]);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      
      let timeOfDay: keyof typeof timeMap;
      if (hour >= 6 && hour < 10) {
        timeOfDay = "Morning (6-10 AM)";
      } else if (hour >= 11 && hour < 15) {
        timeOfDay = "Afternoon (11-3 PM)";
      } else if (hour >= 16 && hour < 20) {
        timeOfDay = "Evening (4-8 PM)";
      } else {
        timeOfDay = "Night (9 PM-5 AM)";
      }
      
      timeMap[timeOfDay].count += 1;
      timeMap[timeOfDay].amount += parseFloat(tx.Amount);
    });
    
    return Object.entries(timeMap).map(([time, data]) => ({
      time,
      count: data.count,
      amount: data.amount,
      percentage: Math.round((data.count / vendorTransactions.length) * 100) || 0
    }));
  }, [vendorTransactions]);

  // Find peak time
  const peakTime = useMemo(() => {
    return transactionsByTime.reduce((peak, current) => 
      current.count > peak.count ? current : peak, 
      { time: "", count: 0, amount: 0, percentage: 0 }
    );
  }, [transactionsByTime]);

  // Find the highest spend
  const highestSpend = useMemo(() => {
    const sorted = [...vendorTransactions].sort((a, b) => 
      parseFloat(b.Amount) - parseFloat(a.Amount)
    );
    return sorted[0] || null;
  }, [vendorTransactions]);

  if (vendorTransactions.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to vendors
        </Button>
        <h2 className="text-2xl font-bold mb-4">Vendor: {vendorName}</h2>
        <p>No transactions found with this vendor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to vendors
        </Button>
      </div>
      
      <h2 className="text-2xl font-bold">{vendorName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Spent</div>
              <div className="text-3xl font-bold flex items-center justify-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {formatCurrency(totalSpent).replace('₹', '')}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Transactions</div>
              <div className="text-3xl font-bold">{vendorTransactions.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Average Transaction</div>
              <div className="text-3xl font-bold flex items-center justify-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {formatCurrency(avgTransaction).replace('₹', '')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Spending by Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={{
                amount: { theme: { light: "#4f46e5", dark: "#818cf8" } },
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border rounded shadow text-xs">
                              <p className="font-medium">{payload[0].payload.month}</p>
                              <p>Transactions: {payload[0].payload.count}</p>
                              <p className="flex items-center">
                                <IndianRupee className="h-3 w-3 mr-1" />
                                {formatCurrency(payload[0].payload.amount).replace('₹', '')}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      name="Total Amount"
                      dataKey="amount" 
                      fill="var(--color-amount)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Transaction Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactionsByTime.map((timing) => (
                <div key={timing.time} className="flex items-center justify-between">
                  <span className={`${timing.time === peakTime.time ? 'font-medium' : ''}`}>
                    {timing.time}
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${timing.time === peakTime.time ? 'bg-blue-600' : 'bg-blue-400'}`}
                        style={{ width: `${timing.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{timing.percentage}%</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-sm text-blue-600 font-medium">
                Peak transaction time: {peakTime.time}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Time</th>
                  <th className="text-right py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {vendorTransactions.slice(0, 10).map((tx) => (
                  <tr key={tx._id} className="border-b">
                    <td className="py-2">{new Date(tx.Date).toLocaleDateString()}</td>
                    <td className="py-2">{tx.Paid_To_Who?.time || 'N/A'}</td>
                    <td className="py-2 text-right flex items-center justify-end">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {formatCurrency(tx.Amount).replace('₹', '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vendorTransactions.length > 10 && (
              <div className="mt-2 text-sm text-gray-500 text-center">
                Showing 10 of {vendorTransactions.length} transactions
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <IndianRupee className="h-5 w-5 mr-2 text-blue-500" />
            Highest Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          {highestSpend && (
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="text-xl font-bold flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {formatCurrency(highestSpend.Amount).replace('₹', '')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="text-lg">{new Date(highestSpend.Date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="text-lg">{highestSpend.Paid_To_Who?.time || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDetails;
