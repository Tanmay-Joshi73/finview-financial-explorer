"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, TrendingUp, Lightbulb, AlertTriangle, PieChart, DollarSign, Calendar, ChevronUp, ChevronDown, BarChart4 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function InvestmentSuggestions({ data }: { data: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <CardContent className="pt-10 pb-10">
          <div className="text-center space-y-4">
            <div className="bg-indigo-50 p-3 rounded-full inline-flex items-center justify-center">
              <PieChart className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">No investment data available</h3>
            <p className="text-gray-600 max-w-md mx-auto">Upload a bank statement to see personalized investment suggestions.</p>
            <div className="pt-2">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all">
                Upload Statement
              </button>
            </div>
          </div>
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
  
  // Calculate savings trend
  const savingsTrend = sortedData.length > 1 
    ? latestMonth.potentialSavings > sortedData[sortedData.length - 2].potentialSavings
    : null

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <h3 className="font-semibold">Investment Potential</h3>
          </div>
          <p className="text-sm opacity-80">Based on your recent spending patterns</p>
        </div>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-sm border-t border-l border-white">
              <div className="flex justify-between items-start">
                <h3 className="text-sm text-gray-500 mb-1">Potential Monthly Savings</h3>
                {savingsTrend !== null && (
                  <div className={`p-1 rounded-full ${savingsTrend ? "bg-green-100" : "bg-red-100"}`}>
                    {savingsTrend ? <ChevronUp className="h-4 w-4 text-green-600" /> : <ChevronDown className="h-4 w-4 text-red-600" />}
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-indigo-900">{formatCurrency(latestMonth.potentialSavings)}</p>
              <p className="text-sm text-gray-500 mt-2 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Based on {latestMonth.month} {latestMonth.year} spending</span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-sm border-t border-l border-white">
              <h3 className="text-sm text-gray-500 mb-1">Savings Profile</h3>
              <p className="text-xl font-bold text-indigo-900">{latestMonth.savingsProfile}</p>
              <div className="mt-3">
                <Badge
                  className={`${
                    latestMonth.savingsProfile.includes("High")
                      ? "bg-green-100 text-green-800"
                      : latestMonth.savingsProfile.includes("Moderate")
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                  } px-3 py-1 rounded-full text-xs`}
                >
                  {latestMonth.savingsProfile.split(" ")[0]}
                </Badge>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-sm border-t border-l border-white">
              <h3 className="text-sm text-gray-500 mb-1">Weekend Spending</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-xl font-bold text-indigo-900">{latestMonth.weekendSpendingPercentage.toFixed(1)}%</p>
                <span className={`text-xs ${latestMonth.weekendSpendingPercentage > 40 ? "text-amber-600" : "text-green-600"}`}>
                  {latestMonth.weekendSpendingPercentage > 40 ? "High" : "Balanced"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {formatCurrency(latestMonth.weekendSpend)} of total spending
              </p>
              <div className="mt-2 bg-gray-200 h-2 rounded-full w-full">
                <div 
                  className={`h-2 rounded-full ${latestMonth.weekendSpendingPercentage > 40 ? "bg-amber-500" : "bg-green-500"}`} 
                  style={{ width: `${Math.min(latestMonth.weekendSpendingPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <h3 className="font-semibold">Investment Suggestions</h3>
          </div>
          <p className="text-sm opacity-80">Personalized investment recommendations</p>
        </div>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestMonth.investmentSuggestions.map((suggestion: string, index: number) => (
              <Alert key={index} className="border-l-4 border-emerald-500 bg-emerald-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex space-x-3">
                  <div className="bg-emerald-100 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-4 w-4 text-emerald-600" />
                  </div>
                  <AlertDescription className="text-gray-700">{suggestion}</AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-4">
          <div className="flex items-center space-x-2">
            <BarChart4 className="h-5 w-5" />
            <h3 className="font-semibold">Monthly Investment Analysis</h3>
          </div>
          <p className="text-sm opacity-80">Track your investment potential over time</p>
        </div>
        <CardContent className="pt-6">
          <Tabs defaultValue="table">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50 p-1 rounded-lg">
              <TabsTrigger value="table" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
                Table View
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
                Key Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6">
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-3 text-left font-medium text-gray-700">Month</th>
                      <th className="p-3 text-left font-medium text-gray-700">Total Spent</th>
                      <th className="p-3 text-left font-medium text-gray-700">Potential Savings</th>
                      <th className="p-3 text-left font-medium text-gray-700">Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((month, index) => {
                      const isLatest = index === sortedData.length - 1;
                      return (
                        <tr key={index} className={`border-t ${isLatest ? "bg-blue-50/30" : ""}`}>
                          <td className="p-3 font-medium">
                            {month.month} {month.year} {isLatest && <span className="text-xs text-blue-600 ml-1">(Latest)</span>}
                          </td>
                          <td className="p-3">{formatCurrency(month.totalSpent)}</td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <span>{formatCurrency(month.potentialSavings)}</span>
                              {index > 0 && (
                                <div className={`p-0.5 rounded-full ${month.potentialSavings > sortedData[index-1].potentialSavings ? "bg-green-100" : "bg-red-100"}`}>
                                  {month.potentialSavings > sortedData[index-1].potentialSavings ? 
                                    <ChevronUp className="h-3 w-3 text-green-600" /> : 
                                    <ChevronDown className="h-3 w-3 text-red-600" />
                                  }
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge
                              className={`${
                                month.savingsProfile.includes("High")
                                  ? "bg-green-100 text-green-800"
                                  : month.savingsProfile.includes("Moderate")
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                              } px-3 py-1 rounded-full text-xs`}
                            >
                              {month.savingsProfile.split(" ")[0]}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <div className="space-y-4">
                <Alert className="bg-gradient-to-r from-blue-50 to-sky-50 border-l-4 border-blue-500 shadow-sm">
                  <div className="flex space-x-3">
                    <div className="bg-blue-100 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <AlertTitle className="text-blue-800">Savings Trend</AlertTitle>
                      <AlertDescription className="text-gray-700">
                        {sortedData.length > 1
                          ? `Your savings potential has ${
                              sortedData[sortedData.length - 1].potentialSavings > sortedData[sortedData.length - 2].potentialSavings
                                ? "increased"
                                : "decreased"
                            } since last month. ${
                              sortedData[sortedData.length - 1].potentialSavings > sortedData[sortedData.length - 2].potentialSavings
                                ? "Great job!"
                                : "There's room for improvement."
                            }`
                          : "Not enough data to determine savings trend yet. Keep using the app to track your progress."
                        }
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>

                <Alert className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 shadow-sm">
                  <div className="flex space-x-3">
                    <div className="bg-amber-100 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <AlertTitle className="text-amber-800">Weekend Spending</AlertTitle>
                      <AlertDescription className="text-gray-700">
                        {latestMonth.weekendSpendingPercentage > 40
                          ? `You spend ${latestMonth.weekendSpendingPercentage.toFixed(1)}% of your money on weekends. Consider creating a separate weekend entertainment budget to better manage these expenses.`
                          : `Your weekend spending is well-balanced at ${latestMonth.weekendSpendingPercentage.toFixed(1)}% of total spending. This shows disciplined spending habits throughout the week.`
                        }
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>

                <Alert className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 shadow-sm">
                  <div className="flex space-x-3">
                    <div className="bg-emerald-100 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <Info className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <AlertTitle className="text-emerald-800">Investment Recommendation</AlertTitle>
                      <AlertDescription className="text-gray-700">
                        Based on your <span className="font-medium">{latestMonth.savingsProfile}</span> savings profile, we recommend{" "}
                        {latestMonth.savingsProfile.includes("High")
                          ? "investing in equity mutual funds or ETFs for long-term growth. Your spending habits suggest you can handle moderate market volatility."
                          : latestMonth.savingsProfile.includes("Moderate")
                            ? "starting systematic investment plans (SIPs) in balanced mutual funds to build wealth steadily while managing risk."
                            : "focusing first on building an emergency fund of 3-6 months of expenses, then exploring conservative investment options like high-yield savings accounts."
                        }
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}