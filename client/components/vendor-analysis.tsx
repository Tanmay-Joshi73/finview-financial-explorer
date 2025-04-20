"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { formatCurrency, formatDate } from "@/lib/utils"

export default function VendorAnalysis({ data }: { data: any }) {
  if (!data || !data.vendorStats) {
    return <div>No vendor data available</div>
  }

  const { vendorStats, monthlyPatterns, timePatterns, dailyPatterns } = data

  // Top 5 vendors for display
  const topVendors = vendorStats.slice(0, 5)

  // Format vendor stats for chart
  const vendorChartData = topVendors.map((vendor: any) => ({
    name: vendor._id,
    total: Number.parseFloat(vendor.totalSpent),
    transactions: vendor.transactionCount,
    average: Number.parseFloat(vendor.avgTransaction),
  }))

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Vendors</CardTitle>
          <CardDescription>Where you spend the most money</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Vendor: ${label}`}
                />
                <Legend />
                <Bar dataKey="total" name="Total Spent" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Spending Distribution</CardTitle>
            <CardDescription>Percentage of spending by vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {vendorChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Details</CardTitle>
            <CardDescription>Detailed information about your top vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Avg. Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendors.map((vendor: any) => (
                  <TableRow key={vendor._id}>
                    <TableCell className="font-medium">{vendor._id}</TableCell>
                    <TableCell>{formatCurrency(vendor.totalSpent)}</TableCell>
                    <TableCell>{vendor.transactionCount}</TableCell>
                    <TableCell>{formatCurrency(vendor.avgTransaction)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>First & Last Transactions</CardTitle>
          <CardDescription>When you first and last transacted with each vendor</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>First Transaction</TableHead>
                <TableHead>Last Transaction</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topVendors.map((vendor: any) => {
                const first = new Date(vendor.firstTransaction)
                const last = new Date(vendor.lastTransaction)
                const durationDays = Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))

                return (
                  <TableRow key={vendor._id}>
                    <TableCell className="font-medium">{vendor._id}</TableCell>
                    <TableCell>{formatDate(vendor.firstTransaction)}</TableCell>
                    <TableCell>{formatDate(vendor.lastTransaction)}</TableCell>
                    <TableCell>{durationDays} days</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
