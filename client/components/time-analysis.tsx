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
} from "recharts"
import { formatCurrency } from "@/lib/utils"

export default function TimeAnalysis({ data }: { data: any }) {
  if (!data || !data.timeBlocks) {
    return <div>No time analysis data available</div>
  }

  const { timeBlocks, weekendVsWeekday } = data

  // Format time blocks data for chart
  const timeBlocksData = timeBlocks.map((block: any) => ({
    name: block._id,
    amount: Number.parseFloat(block.total),
    transactions: block.count,
  }))

  // Format weekend vs weekday data
  const weekendData = weekendVsWeekday.map((item: any) => ({
    name: item._id ? "Weekend" : "Weekday",
    amount: Number.parseFloat(item.total),
    transactions: item.count,
  }))

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]
  const WEEKEND_COLORS = ["#0088FE", "#00C49F"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Time of Day</CardTitle>
            <CardDescription>How your spending varies throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeBlocksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Amount" fill="#0088FE" />
                  <Bar dataKey="transactions" name="Transactions" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekend vs Weekday Spending</CardTitle>
            <CardDescription>Comparing your spending habits on weekends and weekdays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={weekendData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {weekendData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={WEEKEND_COLORS[index % WEEKEND_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Block Analysis</CardTitle>
          <CardDescription>Detailed breakdown of spending by time of day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timeBlocksData.map((block: any) => (
              <div key={block.name} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg">{block.name}</h3>
                <p className="text-2xl font-bold mt-2">{formatCurrency(block.amount)}</p>
                <p className="text-sm text-gray-500 mt-1">{block.transactions} transactions</p>
                <p className="text-sm text-gray-500 mt-1">Avg: {formatCurrency(block.amount / block.transactions)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekend vs Weekday Comparison</CardTitle>
          <CardDescription>Detailed comparison of weekend and weekday spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weekendData.map((item: any) => (
              <div key={item.name} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-xl mb-2">{item.name}</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">{formatCurrency(item.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transactions</p>
                    <p className="text-lg font-medium">{item.transactions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average per Transaction</p>
                    <p className="text-lg font-medium">{formatCurrency(item.amount / item.transactions)}</p>
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
