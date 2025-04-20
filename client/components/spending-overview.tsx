"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, TrendingUp, Award, Calendar, ShoppingBag, BarChart2 } from "lucide-react"

export default function SpendingOverview({ data }: { data: any }) {
  if (!data || !data.totalSpent) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center p-6">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Data Available</h3>
          <p className="mt-2 text-sm text-gray-500">Spending data is not available at the moment.</p>
        </div>
      </div>
    )
  }

  const { totalSpent, monthly, topVendors, dayOfWeek } = data

  // Format monthly data for chart
  const monthlyData = monthly.map((item: any) => ({
    name: item._id,
    amount: Number.parseFloat(item.total),
    transactions: item.count,
  }))

  // Format top vendors data for chart
  const vendorsData = topVendors.slice(0, 6).map((item: any) => ({
    name: item._id,
    amount: Number.parseFloat(item.total),
    transactions: item.count,
    value: Number.parseFloat(item.total), // For easier display in tooltip
  }))

  // Calculate total amount from top vendors for percentage calculation
  const topVendorsTotal = vendorsData.reduce((acc: number, vendor: any) => acc + vendor.amount, 0)

  // Format day of week data for chart
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfWeekData = dayOfWeek
    .map((item: any) => ({
      name: dayNames[parseInt(item._id)],
      dayNum: parseInt(item._id),
      amount: Number.parseFloat(item.total),
      transactions: item.count,
    }))
    .sort((a: any, b: any) => a.dayNum - b.dayNum)

  // Get highest spending day
  const highestSpendingDay = [...dayOfWeekData].sort((a, b) => b.amount - a.amount)[0]

  // Calculate monthly trends (increasing or decreasing)
  const monthlyTrend = monthlyData.length > 1 
    ? (monthlyData[monthlyData.length - 1].amount > monthlyData[monthlyData.length - 2].amount 
      ? 'increase' : 'decrease')
    : 'neutral'

  // Vibrant color palette
  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981", "#06b6d4", "#f59e0b"]
  const GRADIENT_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"]
  const DAY_COLORS = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#f59e0b"]

  return (
    <div className="space-y-6">
      {/* Hero Stats Section */}
      <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg text-white mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 mr-2 text-blue-200" />
              <h3 className="text-lg font-medium text-blue-100">Total Spending</h3>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalSpent.totalAmount)}</p>
            <p className="mt-2 text-sm text-blue-200">{totalSpent.transactionCount} total transactions</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-200" />
              <h3 className="text-lg font-medium text-blue-100">Average Transaction</h3>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalSpent.totalAmount / totalSpent.transactionCount)}</p>
            <p className="mt-2 text-sm text-blue-200">Per transaction</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 mr-2 text-blue-200" />
              <h3 className="text-lg font-medium text-blue-100">Top Vendor</h3>
            </div>
            <p className="text-3xl font-bold truncate">{topVendors[0]?._id || "N/A"}</p>
            <p className="mt-2 text-sm text-blue-200">
              {topVendors[0] ? formatCurrency(topVendors[0].total) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly and Top Vendors Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" /> Monthly Spending Trends
            </CardTitle>
            <CardDescription className="text-blue-100">Your spending patterns across months</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#4b5563' }} />
                  <YAxis tick={{ fill: '#4b5563' }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), "Amount"]}
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none'
                    }}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    name="Monthly Spending" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <div className={`rounded-full p-2 ${monthlyTrend === 'increase' ? 'bg-red-100' : 'bg-green-100'} mr-3`}>
                  <TrendingUp 
                    className={`h-5 w-5 ${monthlyTrend === 'increase' ? 'text-red-600' : 'text-green-600'}`} 
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {monthlyTrend === 'increase' 
                      ? 'Your spending has increased compared to the previous month.' 
                      : 'Your spending has decreased compared to the previous month.'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {monthlyTrend === 'increase' 
                      ? 'Consider reviewing your budget to identify areas to save.' 
                      : 'Great job controlling your expenses!'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" /> Top Vendors
            </CardTitle>
            <CardDescription className="text-purple-100">Where you spend the most</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={110}
                    innerRadius={55}
                    fill="#8884d8"
                    dataKey="amount"
                    paddingAngle={2}
                  >
                    {vendorsData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day of Week Spending */}
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" /> Spending by Day of Week
          </CardTitle>
          <CardDescription className="text-emerald-100">How your spending varies across the week</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData} barGap={8} barCategoryGap={16}>
                <defs>
                  {DAY_COLORS.map((color, index) => (
                    <linearGradient key={`gradient-${index}`} id={`colorDay${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#4b5563' }} />
                <YAxis tick={{ fill: '#4b5563' }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "amount" ? formatCurrency(value) : value,
                    name === "amount" ? "Amount" : "Transactions"
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="amount" 
                  name="Amount" 
                  radius={[4, 4, 0, 0]}
                >
                  {dayOfWeekData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorDay${index})`} />
                  ))}
                </Bar>
                <Bar 
                  dataKey="transactions" 
                  name="Transactions" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-7 gap-2">
            {dayOfWeekData.map((day: any, index: number) => (
              <Card key={day.name} className="border border-gray-100 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center">
                    <p className="text-xs text-gray-500">{day.name}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: DAY_COLORS[index] }}>
                      {formatCurrency(day.amount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Vendors and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
            <CardTitle>Top Vendors Breakdown</CardTitle>
            <CardDescription className="text-pink-100">Where your money goes most frequently</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {vendorsData.map((vendor: any, index: number) => (
                <div key={vendor.name} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                      >
                        <ShoppingBag 
                          className="h-4 w-4" 
                          style={{ color: COLORS[index % COLORS.length] }} 
                        />
                      </div>
                      <span className="font-medium truncate max-w-[150px]">{vendor.name}</span>
                    </div>
                    <span className="font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                      {formatCurrency(vendor.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${(vendor.amount / topVendorsTotal) * 100}%`, 
                        backgroundColor: COLORS[index % COLORS.length] 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{vendor.transactions} transactions</span>
                    <span>{((vendor.amount / topVendorsTotal) * 100).toFixed(1)}% of spending</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
            <CardTitle>Spending Insights</CardTitle>
            <CardDescription className="text-cyan-100">Key observations about your spending habits</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800">Highest Spending Day</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      You spend the most on <span className="font-medium">{highestSpendingDay.name}</span>, 
                      averaging {formatCurrency(highestSpendingDay.amount)} across {highestSpendingDay.transactions} transactions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <ShoppingBag className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-800">Vendor Concentration</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your top 3 vendors account for {
                        ((topVendors.slice(0, 3).reduce((sum: number, vendor: any) => sum + Number.parseFloat(vendor.total), 0) / 
                        totalSpent.totalAmount) * 100).toFixed(1)
                      }% of your total spending.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-3">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-800">Monthly Trend</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {monthlyData.length > 2 
                        ? `Your spending ${monthlyTrend === 'increase' ? 'increased' : 'decreased'} by ${
                            Math.abs(((monthlyData[monthlyData.length - 1].amount - monthlyData[monthlyData.length - 2].amount) / 
                            monthlyData[monthlyData.length - 2].amount) * 100).toFixed(1)
                          }% compared to the previous month.`
                        : 'Not enough data to determine a monthly spending trend.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-3">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">Transaction Size</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your average transaction size is {formatCurrency(totalSpent.totalAmount / totalSpent.transactionCount)}.
                      {vendorsData.length > 0 && ` Your largest average transaction is with ${
                        vendorsData.sort((a: any, b: any) => (b.amount / b.transactions) - (a.amount / a.transactions))[0].name
                      } at ${formatCurrency(
                        vendorsData.sort((a: any, b: any) => (b.amount / b.transactions) - (a.amount / a.transactions))[0].amount / 
                        vendorsData.sort((a: any, b: any) => (b.amount / b.transactions) - (a.amount / a.transactions))[0].transactions
                      )}.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}