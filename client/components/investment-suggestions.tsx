"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, TrendingUp, Lightbulb, AlertTriangle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function InvestmentSuggestions({ data }: { data: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No investment data available</AlertTitle>
            <AlertDescription>Upload a bank statement to see investment suggestions.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Sort data by month and year
  const sortedData = [...data].sort((a, b) => {
    const monthOrder = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    }
    const aMonth = monthOrder[a.month as keyof typeof monthOrder] || 0
    const bMonth = monthOrder[b.month as keyof typeof monthOrder] || 0

    if (a.year !== b.year) {
      return a.year - b.year
    }
    return aMonth - bMonth
  })

  // Get the most recent month's data
  const latestMonth = sortedData[sortedData.length - 1]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Potential</CardTitle>
          <CardDescription>Based on your recent spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Potential Monthly Savings</h3>
              <p className="text-3xl font-bold">{formatCurrency(latestMonth.potentialSavings)}</p>
              <p className="text-sm text-gray-500 mt-2">
                Based on {latestMonth.month} {latestMonth.year} spending
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Savings Profile</h3>
              <p className="text-xl font-bold">{latestMonth.savingsProfile}</p>
              <div className="mt-2">
                <Badge
                  variant={
                    latestMonth.savingsProfile.includes("High")
                      ? "default"
                      : latestMonth.savingsProfile.includes("Moderate")
                        ? "secondary"
                        : "outline"
                  }
                >
                  {latestMonth.savingsProfile.split(" ")[0]}
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Weekend Spending</h3>
              <p className="text-xl font-bold">{latestMonth.weekendSpendingPercentage.toFixed(1)}%</p>
              <p className="text-sm text-gray-500 mt-2">{formatCurrency(latestMonth.weekendSpend)} of total spending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Suggestions</CardTitle>
          <CardDescription>Personalized investment recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestMonth.investmentSuggestions.map((suggestion: string, index: number) => (
              <Alert key={index}>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>{suggestion}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Investment Analysis</CardTitle>
          <CardDescription>Track your investment potential over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="insights">Key Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">Month</th>
                      <th className="p-2 text-left font-medium">Total Spent</th>
                      <th className="p-2 text-left font-medium">Potential Savings</th>
                      <th className="p-2 text-left font-medium">Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((month, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">
                          {month.month} {month.year}
                        </td>
                        <td className="p-2">{formatCurrency(month.totalSpent)}</td>
                        <td className="p-2">{formatCurrency(month.potentialSavings)}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              month.savingsProfile.includes("High")
                                ? "default"
                                : month.savingsProfile.includes("Moderate")
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {month.savingsProfile.split(" ")[0]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-4">
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Savings Trend</AlertTitle>
                  <AlertDescription>
                    {sortedData.length > 1
                      ? `Your savings potential has ${
                          sortedData[sortedData.length - 1].potentialSavings > sortedData[0].potentialSavings
                            ? "increased"
                            : "decreased"
                        } over time.`
                      : "Not enough data to determine savings trend."}
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Weekend Spending</AlertTitle>
                  <AlertDescription>
                    {latestMonth.weekendSpendingPercentage > 40
                      ? `You spend ${latestMonth.weekendSpendingPercentage.toFixed(1)}% of your money on weekends. Consider budgeting for weekend activities.`
                      : `Your weekend spending is well-balanced at ${latestMonth.weekendSpendingPercentage.toFixed(1)}% of total spending.`}
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Investment Recommendation</AlertTitle>
                  <AlertDescription>
                    Based on your spending profile, consider{" "}
                    {latestMonth.savingsProfile.includes("High")
                      ? "investing in equity mutual funds for long-term growth."
                      : latestMonth.savingsProfile.includes("Moderate")
                        ? "starting SIPs in debt mutual funds."
                        : "focusing on budgeting and building an emergency fund first."}
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
