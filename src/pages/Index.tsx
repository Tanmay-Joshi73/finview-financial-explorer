
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/FileUpload";
import { Loader2, PiggyBank, ChartBar, TrendingUp } from "lucide-react";
import { DashboardData } from "@/types";

const Index = () => {
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUploadStart = () => {
    setUploading(true);
  };

  const handleUploadSuccess = (data: DashboardData) => {
    // Navigate to dashboard with data
    navigate('/dashboard', { state: { dashboardData: data } });
    setUploading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center">
            <PiggyBank className="h-10 w-10 mr-3" />
            <div>
              <h1 className="text-4xl font-bold">FinView</h1>
              <p className="text-blue-100">Financial Statement Explorer</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100">
        {uploading ? (
          <div className="container mx-auto py-16 px-4">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-finance-blue mb-4" />
              <h2 className="text-xl font-medium mb-2">Processing Your Statement...</h2>
              <p className="text-gray-500">This may take a moment as we analyze your data</p>
            </div>
          </div>
        ) : (
          <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-green-500">
                Transform Your Financial Data Into Actionable Insights
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your bank statement and get a detailed breakdown of your spending habits, top merchants, and discover opportunities to save money.
              </p>
            </div>
            
            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="feature-card">
                <div className="feature-icon bg-blue-100">
                  <ChartBar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mt-4">Spending Analytics</h3>
                <p className="text-gray-600">Get a complete breakdown of your spending patterns and identify areas to save money.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon bg-green-100">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mt-4">Visual Reports</h3>
                <p className="text-gray-600">Interactive charts and graphs to help you understand your financial data at a glance.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon bg-purple-100">
                  <PiggyBank className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mt-4">Saving Opportunities</h3>
                <p className="text-gray-600">Discover where you can cut costs and build better financial habits.</p>
              </div>
            </div>
            
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadStart={handleUploadStart}
            />
          </div>
        )}
      </main>
      
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <PiggyBank className="h-8 w-8 inline-block mr-2" />
            <span className="text-xl font-bold">FinView</span>
          </div>
          <p className="text-blue-200">Your data is processed securely and never stored</p>
          <p className="text-blue-300 text-sm mt-2">&copy; {new Date().getFullYear()} FinView - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
