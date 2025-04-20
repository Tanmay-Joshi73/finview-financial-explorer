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
  RadialBarChart,
  RadialBar,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Clock, Calendar, TrendingUp, DollarSign, Activity } from "lucide-react"

export default function TimeAnalysis({ data }: { data: any }) {
  if (!data || !data.timeBlocks) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center p-6">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Data Available</h3>
          <p className="mt-2 text-sm text-gray-500">Time analysis data is not available at the moment.</p>
        </div>
      </div>
    )
  }

  const { timeBlocks, weekendVsWeekday } = data

  // Format time blocks data for chart
  const timeBlocksData = timeBlocks.map((block: any) => ({
    name: block._id,
    amount: Number.parseFloat(block.total),
    transactions: block.count,
    avg: Number.parseFloat(block.total) / block.count,
  }))

  // Format weekend vs weekday data
  const weekendData = weekendVsWeekday.map((item: any) => ({
    name: item._id ? "Weekend" : "Weekday",
    amount: Number.parseFloat(item.total),
    transactions: item.count,
  }))

  // Calculate totals for summary stats
  const totalSpent = timeBlocksData.reduce((sum: number, block: any) => sum + block.amount, 0)
  const totalTransactions = timeBlocksData.reduce((sum: number, block: any) => sum + block.transactions, 0)
  
  // Find peak spending time
  const peakBlock = [...timeBlocksData].sort((a, b) => b.amount - a.amount)[0]

  // Colors for charts - vibrant, eye-catching palette
  const COLORS = ["#2563eb", "#0ea5e9", "#14b8a6", "#10b981", "#6366f1", "#8b5cf6"]
  const WEEKEND_COLORS = ["#10b981", "#6366f1"]
  const GRADIENT_COLORS = ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Spending</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Transactions</p>
                <p className="text-2xl font-bold mt-1">{totalTransactions}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Average Transaction</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalSpent / totalTransactions)}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">Peak Spending Time</p>
                <p className="text-2xl font-bold mt-1">{peakBlock.name}</p>
              </div>
              <div className="bg-cyan-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" /> Spending by Time of Day
            </CardTitle>
            <CardDescription className="text-blue-100">How your spending varies throughout the day</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeBlocksData} barCategoryGap={16}>
                  <defs>
                    {GRADIENT_COLORS.map((color, index) => (
                      <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorGradient0)" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="transactions" 
                    name="Transactions" 
                    fill="url(#colorGradient2)" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Weekend vs Weekday Spending
            </CardTitle>
            <CardDescription className="text-purple-100">Comparing your spending habits on weekends and weekdays</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <radialGradient id="weekdayGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                    </radialGradient>
                    <radialGradient id="weekendGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                    </radialGradient>
                  </defs>
                  <Pie
                    data={weekendData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="amount"
                    paddingAngle={4}
                  >
                    {weekendData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? "url(#weekdayGradient)" : "url(#weekendGradient)"} 
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

      {/* Time Block Analysis Cards */}
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle>Time Block Analysis</CardTitle>
          <CardDescription className="text-blue-100">Detailed breakdown of spending by time of day</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timeBlocksData.map((block: any, index: number) => (
              <Card key={block.name} className="overflow-hidden border-none shadow-md">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}>
                      <Clock className="h-5 w-5" style={{ color: COLORS[index % COLORS.length] }} />
                    </div>
                    <h3 className="font-medium text-lg">{block.name}</h3>
                  </div>
                  <p className="text-3xl font-bold mb-3" style={{ color: COLORS[index % COLORS.length] }}>
                    {formatCurrency(block.amount)}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Transactions</p>
                      <p className="font-medium text-lg">{block.transactions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg/Transaction</p>
                      <p className="font-medium text-lg">{formatCurrency(block.avg)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekend vs Weekday Comparison */}
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardTitle>Weekend vs Weekday Comparison</CardTitle>
          <CardDescription className="text-purple-100">Detailed comparison of weekend and weekday spending patterns</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weekendData.map((item: any, index: number) => (
              <div key={item.name} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div 
                    className="rounded-full p-3 mr-3" 
                    style={{ backgroundColor: `${WEEKEND_COLORS[index % WEEKEND_COLORS.length]}20` }}
                  >
                    <Calendar 
                      className="h-6 w-6" 
                      style={{ color: WEEKEND_COLORS[index % WEEKEND_COLORS.length] }} 
                    />
                  </div>
                  <h3 className="font-semibold text-xl">{item.name}</h3>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold" style={{ color: WEEKEND_COLORS[index % WEEKEND_COLORS.length] }}>
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Transactions</p>
                      <p className="text-xl font-medium">{item.transactions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average per Transaction</p>
                      <p className="text-xl font-medium">{formatCurrency(item.amount / item.transactions)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">% of Total Spending</span>
                      <span className="text-sm font-medium">
                        {((item.amount / totalSpent) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${(item.amount / totalSpent) * 100}%`,
                          backgroundColor: WEEKEND_COLORS[index % WEEKEND_COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}