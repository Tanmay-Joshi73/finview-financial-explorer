import { Suspense } from "react"
import Dashboard from "@/components/dashboard"
import UploadForm from "@/components/upload-form"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Finance Advisor</h1>

        <UploadForm />

        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      </div>
    </div>
  )
}
