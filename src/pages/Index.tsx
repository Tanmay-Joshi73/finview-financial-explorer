
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/FileUpload";
import { Loader2 } from "lucide-react";
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
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-finance-blue">FinView</h1>
          <p className="text-gray-600">Financial Statement Explorer</p>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50">
        {uploading ? (
          <div className="container mx-auto py-16 px-4">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-finance-blue mb-4" />
              <h2 className="text-xl font-medium mb-2">Processing Your Statement...</h2>
              <p className="text-gray-500">This may take a moment as we analyze your data</p>
            </div>
          </div>
        ) : (
          <div className="container mx-auto py-16 px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Transform Your Bank Statements Into Insights</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your bank statement and get a detailed breakdown of your spending habits, top merchants, and discover opportunities to save money.
              </p>
            </div>
            
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadStart={handleUploadStart}
            />
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>FinView &copy; {new Date().getFullYear()} - Your data is processed securely and never stored</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
