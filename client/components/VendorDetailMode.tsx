import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowDownCircle, 
  TrendingUp, 
  FileText,
  BarChart2,
  PieChart as PieChartIcon,
  LayoutList,
  ListIcon,
  Info
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
// import { VendorTransactionsList } from './VendorTransactionDetail';
import VendorTransactionsList from './VendorTrasanctionDetail';
interface VendorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  vendorData: any;
  recentTransactions: any[];
  monthlyData: any[];
  dailyData: any[];
}

// Helper function to format date for chart
const formatChartDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Transaction amount color based on size
const getAmountColor = (amount: number) => {
  if (amount > 500) return 'text-red-600';
  if (amount > 200) return 'text-orange-500';
  if (amount > 50) return 'text-blue-600';
  return 'text-green-600';
};

// Card background based on amount
const getAmountBackground = (amount: number) => {
  if (amount > 500) return 'bg-red-50';
  if (amount > 200) return 'bg-orange-50';
  if (amount > 50) return 'bg-blue-50';
  return 'bg-green-50';
};

const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  vendorData,
  recentTransactions,
  monthlyData,
  dailyData
}) => {
  if (!vendorData) return null;
  
  // Format transaction data for timeline chart
  const timelineData = recentTransactions.map(tx => ({
    date: formatChartDate(tx.date),
    amount: tx.amount,
    fullDate: tx.date
  })).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  
  // Colors for charts
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];
  
  // Format daily data for chart
  const formattedDailyData = dailyData?.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  })) || [];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-indigo-500" />
            <span>{vendorName}</span>
            <Badge className="ml-2 bg-indigo-100 text-indigo-800">
              {vendorData.transactionCount} transactions
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Total spent: {formatCurrency(vendorData.totalSpent)} · First transaction: {formatDate(vendorData.firstTransaction)} · 
            Last transaction: {formatDate(vendorData.lastTransaction)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="transactions" className="flex items-center gap-1">
              <LayoutList className="h-4 w-4" />
              <span>Recent</span>
            </TabsTrigger>
            <TabsTrigger value="all-transactions" className="flex items-center gap-1">
              <ListIcon className="h-4 w-4" />
              <span>All Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Patterns</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <PieChartIcon className="h-4 w-4" />
              <span>Summary</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="focus-visible:outline-none">
            <Card className="border-none shadow-md mb-4">
              <CardHeader className="bg-gray-50 border-b border-gray-100 pb-2">
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-700" />
                  Recent Transaction Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#6b7280' }} />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), 'Amount']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#4F46E5" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#4F46E5' }} 
                        activeDot={{ r: 6, fill: '#4F46E5' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <ScrollArea className="h-[350px]">
              <div className="space-y-3 p-1">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, idx) => (
                    <Card 
                      key={idx} 
                      className={`border border-gray-100 shadow-sm transition-all hover:shadow-md ${getAmountBackground(transaction.amount)}`}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                            <ArrowDownCircle className="h-5 w-5 text-indigo-500" />
                          </div>
                          <div>
                            <div className="font-medium">{vendorName}</div>
                            <div className="flex items-center text-sm text-gray-500 gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(transaction.date)}</span>
                              <Clock className="h-3.5 w-3.5 ml-2" />
                              <span>{new Date(transaction.date).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`text-xl font-bold ${getAmountColor(transaction.amount)}`}>
                          {formatCurrency(transaction.amount)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p>No recent transactions available</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="all-transactions" className="focus-visible:outline-none">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="text-base flex items-center">
                  <ListIcon className="h-4 w-4 mr-2 text-gray-700" />
                  All Transactions History
                  <Badge variant="outline" className="ml-2">
                    {vendorData.transactionCount} transactions
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Complete history of all transactions with {vendorName}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4">
                    <VendorTransactionsList
                      transactions={recentTransactions}
                      vendorName={vendorName}
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patterns" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-none shadow-md">
                <CardHeader className="bg-gray-50 border-b border-gray-100 pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-700" />
                    Spending by Day of Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={formattedDailyData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#6b7280' }} />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), 'Amount']}
                        />
                        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                          {formattedDailyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="bg-gray-50 border-b border-gray-100 pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-700" />
                    Monthly Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={monthlyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="total"
                          nameKey="month"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {monthlyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), 'Amount']}
                          labelFormatter={(label) => `Month ${label}`}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-none shadow-md mt-4">
              <CardHeader className="bg-gray-50 border-b border-gray-100 pb-2">
                <CardTitle className="text-base flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-700" />
                  Spending Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-xs font-medium text-blue-600 mb-1">Average Transaction</div>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(vendorData.avgTransaction)}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-xs font-medium text-green-600 mb-1">Total Spent</div>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(vendorData.totalSpent)}</div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="text-xs font-medium text-amber-600 mb-1">Transactions</div>
                    <div className="text-xl font-bold text-gray-900">{vendorData.transactionCount}</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-xs font-medium text-purple-600 mb-1">Frequency</div>
                    <div className="text-xl font-bold text-gray-900">
                      {(vendorData.transactionCount / 30).toFixed(1)} per month
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary" className="focus-visible:outline-none">
            <Card className="border-none shadow-md mb-4">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Vendor Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Vendor Name</span>
                        <span className="font-medium">{vendorName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">First Transaction</span>
                        <span className="font-medium">{formatDate(vendorData.firstTransaction)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Last Transaction</span>
                        <span className="font-medium">{formatDate(vendorData.lastTransaction)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Total Spent</span>
                        <span className="font-medium text-blue-600">{formatCurrency(vendorData.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Transaction Count</span>
                        <span className="font-medium">{vendorData.transactionCount}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Average Transaction</span>
                        <span className="font-medium">{formatCurrency(vendorData.avgTransaction)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Spending Insights</h3>
                    <div className="flex-1 grid grid-cols-1 gap-3">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                        <div className="flex">
                          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center mr-3 shadow-sm">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-blue-800 text-sm font-medium">Spending Pattern</div>
                            <div className="text-blue-900 font-medium">
                              {vendorData.transactionCount > 10 
                                ? 'Frequent transactions' 
                                : vendorData.avgTransaction > 200 
                                  ? 'High-value transactions' 
                                  : 'Moderate spending pattern'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                        <div className="flex">
                          <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center mr-3 shadow-sm">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-green-800 text-sm font-medium">Time Period</div>
                            <div className="text-green-900 font-medium">
                              {Math.round((new Date(vendorData.lastTransaction).getTime() - new Date(vendorData.firstTransaction).getTime()) / (1000 * 60 * 60 * 24))} days
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg">
                        <div className="flex">
                          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center mr-3 shadow-sm">
                            <DollarSign className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-amber-800 text-sm font-medium">Spending Category</div>
                            <div className="text-amber-900 font-medium">
                              {vendorData.totalSpent > 5000 
                                ? 'Major Expense' 
                                : vendorData.totalSpent > 1000 
                                  ? 'Significant Spending' 
                                  : 'Regular Expense'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VendorDetailModal;