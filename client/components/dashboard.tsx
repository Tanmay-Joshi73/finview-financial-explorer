"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { fetchDashboardData, fetchVendorData, fetchPredictionData, fetchInvestmentData } from "@/lib/actions"
import SpendingOverview from "@/components/spending-overview"
import VendorAnalysis from "@/components/vendor-analysis"
import TimeAnalysis from "@/components/time-analysis"
import PredictionInsights from "@/components/prediction-insights"
import InvestmentSuggestions from "@/components/investment-suggestions"

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [vendorData, setVendorData] = useState<any>(null)
  const [predictionData, setPredictionData] = useState<any>(null)
  const [investmentData, setInvestmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [dashboard, vendors, predictions, investments] = await Promise.all([
          fetchDashboardData(),
          fetchVendorData(),
          fetchPredictionData(),
          fetchInvestmentData(),
        ])

        setDashboardData(dashboard)
        setVendorData(vendors)
        setPredictionData(predictions)
        setInvestmentData(investments)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load dashboard data. Please try uploading a statement first.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading dashboard data...</div>
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!dashboardData) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload a Statement to Get Started</h3>
            <p className="text-gray-500">Upload your bank statement to see your spending analysis</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="vendors">Vendors</TabsTrigger>
        <TabsTrigger value="time">Time Analysis</TabsTrigger>
        <TabsTrigger value="predictions">Predictions</TabsTrigger>
        <TabsTrigger value="investments">Investments</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <SpendingOverview data={dashboardData} />
      </TabsContent>

      <TabsContent value="vendors" className="mt-6">
        <VendorAnalysis data={vendorData} />
      </TabsContent>

      <TabsContent value="time" className="mt-6">
        <TimeAnalysis data={dashboardData} />
      </TabsContent>

      <TabsContent value="predictions" className="mt-6">
        <PredictionInsights data={predictionData} />
      </TabsContent>

      <TabsContent value="investments" className="mt-6">
        <InvestmentSuggestions data={investmentData} />
      </TabsContent>
    </Tabs>
  )
}
