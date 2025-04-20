"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Info, DollarSign, CreditCard, PieChart, Activity } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function PredictionInsights({ data }: { data: any }) {
  if (!data || !data.prediction) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <CardContent className="pt-10 pb-10">
          <div className="text-center space-y-4">
            <div className="bg-blue-50 p-3 rounded-full inline-flex items-center justify-center">
              <Info className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">No prediction data available</h3>
            <p className="text-gray-600 max-w-md mx-auto">Upload a bank statement to see spending predictions and personalized financial insights.</p>
            <div className="pt-2">
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all">
                Upload Statement
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { prediction, metrics, success } = data

  // Extract prediction data
  const nextMonthEstimate = prediction.nextMonthEstimate || prediction.prediction?.nextMonthEstimate || {}
  const keyVendors = prediction.keyVendors || prediction.prediction?.keyVendors || []
  const categoryTrends = prediction.categoryTrends || prediction.prediction?.categoryTrends || []
  const recommendations = prediction.recommendations || {}

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-primary/90 to-primary text-white p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <h3 className="font-semibold">Next Month Estimate</h3>
            </div>
            <p className="text-sm opacity-80">Predicted spending for the upcoming month</p>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-primary">
                <h3 className="text-sm text-gray-500 mb-1">Estimated Range</h3>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(nextMonthEstimate.min)} - {formatCurrency(nextMonthEstimate.max)}
                </p>
                <div className="flex items-center mt-3">
                  <Badge className={`${nextMonthEstimate.confidence === "high" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"} px-3 py-1 rounded-full text-xs`}>
                    {nextMonthEstimate.confidence || "medium"} confidence
                  </Badge>
                </div>
              </div>

              {metrics && metrics.topVendorsCoverage && (
                <div className="text-sm bg-blue-50 p-3 rounded-lg flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <p className="text-gray-700">
                    Analysis based on your top vendors, which account for <span className="font-semibold">{metrics.topVendorsCoverage.toFixed(1)}%</span> of
                    your spending.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <h3 className="font-semibold">Category Trends</h3>
            </div>
            <p className="text-sm opacity-80">Predicted trends in your spending categories</p>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {categoryTrends.length > 0 ? (
                categoryTrends.map((category: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {category.trend === "increase" ? (
                      <div className="bg-red-100 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-red-600" />
                      </div>
                    ) : category.trend === "decrease" ? (
                      <div className="bg-green-100 p-2 rounded-full">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Info className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-800">{category.category}</h4>
                      <p className="text-sm text-gray-600">{category.reason}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <PieChart className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No category trends available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <h3 className="font-semibold">Key Vendors Forecast</h3>
          </div>
          <p className="text-sm opacity-80">Predicted spending with your most frequent vendors</p>
        </div>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {keyVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keyVendors.map((vendor: any, index: number) => (
                  <div key={index} className={`p-4 rounded-xl border-l-4 ${vendor.riskLevel === "high" ? "border-amber-500 bg-amber-50" : vendor.recurring ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800">{vendor.name}</h3>
                      {vendor.riskLevel === "high" && 
                        <div className="bg-amber-200 p-1 rounded-full">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        </div>
                      }
                    </div>
                    <p className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(vendor.expectedAmount)}</p>
                    <div className="flex items-center mt-3 space-x-2">
                      <Badge className={`${vendor.recurring ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"} px-3 py-1 rounded-full text-xs`}>
                        {vendor.recurring ? "Recurring" : "One-time"}
                      </Badge>
                      {vendor.riskLevel && (
                        <Badge className={`${vendor.riskLevel === "low" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"} px-3 py-1 rounded-full text-xs`}>
                          {vendor.riskLevel} risk
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No vendor forecasts available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <h3 className="font-semibold">Recommendations</h3>
          </div>
          <p className="text-sm opacity-80">Personalized suggestions to improve your finances</p>
        </div>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {recommendations.vendorSpecific && recommendations.vendorSpecific.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-800">Vendor-Specific Recommendations</h3>
                <div className="space-y-3">
                  {recommendations.vendorSpecific.map((rec: any, index: number) => (
                    <Alert key={index} className="border-green-200 bg-green-50">
                      <div className="flex justify-between w-full">
                        <div>
                          <AlertTitle className="text-emerald-800">{rec.vendor}</AlertTitle>
                          <AlertDescription className="text-gray-700">{rec.action}</AlertDescription>
                        </div>
                        {rec.potentialSavings && (
                          <div className="bg-white shadow-sm px-3 py-2 rounded-lg text-green-700 font-medium text-sm">
                            Save up to {rec.potentialSavings}
                          </div>
                        )}
                      </div>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {recommendations.general && recommendations.general.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-800">General Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.general.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!recommendations.vendorSpecific || recommendations.vendorSpecific.length === 0) &&
              (!recommendations.general || recommendations.general.length === 0) && (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Info className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No recommendations available yet</p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}