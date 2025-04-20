"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function PredictionInsights({ data }: { data: any }) {
  if (!data || !data.prediction) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No prediction data available</AlertTitle>
            <AlertDescription>Upload a bank statement to see spending predictions and insights.</AlertDescription>
          </Alert>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Next Month Estimate</CardTitle>
            <CardDescription>Predicted spending for the upcoming month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-1">Estimated Range</h3>
                <p className="text-3xl font-bold">
                  {formatCurrency(nextMonthEstimate.min)} - {formatCurrency(nextMonthEstimate.max)}
                </p>
                <div className="flex items-center mt-2">
                  <Badge variant={nextMonthEstimate.confidence === "high" ? "default" : "outline"}>
                    {nextMonthEstimate.confidence || "medium"} confidence
                  </Badge>
                </div>
              </div>

              {metrics && metrics.topVendorsCoverage && (
                <div className="text-sm text-gray-500">
                  <p>
                    Analysis based on your top vendors, which account for {metrics.topVendorsCoverage.toFixed(1)}% of
                    your spending.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Trends</CardTitle>
            <CardDescription>Predicted trends in your spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTrends.length > 0 ? (
                categoryTrends.map((category: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {category.trend === "increase" ? (
                      <TrendingUp className="h-5 w-5 text-red-500 mt-0.5" />
                    ) : category.trend === "decrease" ? (
                      <TrendingDown className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium">{category.category}</h4>
                      <p className="text-sm text-gray-600">{category.reason}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">No category trends available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Vendors Forecast</CardTitle>
          <CardDescription>Predicted spending with your most frequent vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keyVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keyVendors.map((vendor: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{vendor.name}</h3>
                      {vendor.riskLevel === "high" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    </div>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(vendor.expectedAmount)}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant={vendor.recurring ? "default" : "outline"}>
                        {vendor.recurring ? "Recurring" : "One-time"}
                      </Badge>
                      {vendor.riskLevel && (
                        <Badge variant={vendor.riskLevel === "low" ? "outline" : "secondary"}>
                          {vendor.riskLevel} risk
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No vendor forecasts available</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Personalized suggestions to improve your finances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.vendorSpecific && recommendations.vendorSpecific.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Vendor-Specific Recommendations</h3>
                <div className="space-y-3">
                  {recommendations.vendorSpecific.map((rec: any, index: number) => (
                    <Alert key={index}>
                      <div>
                        <AlertTitle>{rec.vendor}</AlertTitle>
                        <AlertDescription className="flex justify-between">
                          <span>{rec.action}</span>
                          {rec.potentialSavings && (
                            <span className="font-medium">Save up to {rec.potentialSavings}</span>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {recommendations.general && recommendations.general.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">General Recommendations</h3>
                <div className="space-y-2">
                  {recommendations.general.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white text-xs mt-0.5">
                        {index + 1}
                      </div>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!recommendations.vendorSpecific || recommendations.vendorSpecific.length === 0) &&
              (!recommendations.general || recommendations.general.length === 0) && (
                <div className="text-center py-6 text-gray-500">No recommendations available</div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
