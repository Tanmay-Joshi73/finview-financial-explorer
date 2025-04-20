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

export default function SpendingOverview({ data }: { data: any }) {
  if (!data || !data.totalSpent) {
    return <div>No spending data available</div>
  }

  const { totalSpent, monthly, topVendors, dayOfWeek } = data

  // Format monthly data for chart
  const monthlyData = monthly.map((item: any) => ({
    name: item._id,
    amount: Number.parseFloat(item.total),
    transactions: item.count,
  }))

  // Format top vendors data for chart
  const vendorsData = topVendors.map((item: any) => ({
    name: item._id,
    amount: Number.parseFloat(item.total),
    transactions: item.count,
  }))

  // Format day of week data for chart
  const dayOfWeekData = dayOfWeek.map((item: any) => ({
    name: item._id,
    amount: Number.parseFloat(item.total),
    transactions: item.count,
  }))

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Total Spent</CardDescription>
            <CardTitle>{formatCurrency(totalSpent.totalAmount)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Across {totalSpent.transactionCount} transactions</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Average Transaction</CardDescription>
            <CardTitle>{formatCurrency(totalSpent.totalAmount / totalSpent.transactionCount)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Per transaction</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Top Vendor</CardDescription>
            <CardTitle>{topVendors[0]?._id || "N/A"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {topVendors[0] ? formatCurrency(topVendors[0].total) : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Your spending patterns across months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Amount" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Where you spend the most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {vendorsData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          <CardTitle>Spending by Day of Week</CardTitle>
          <CardDescription>How your spending varies across the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Legend />
                <Bar dataKey="amount" name="Amount" fill="#00C49F" />
                <Bar dataKey="transactions" name="Transactions" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
