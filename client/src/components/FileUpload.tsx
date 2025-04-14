
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud, FileText, Check, X, HelpCircle, File, BarChart } from "lucide-react";
import { api } from "@/services/api";
import { DashboardData } from "@/types";

interface FileUploadProps {
  onUploadSuccess: (data: DashboardData) => void;
  onUploadStart: () => void;
}

const FileUpload = ({ onUploadSuccess, onUploadStart }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      setCurrentStep(2);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
      setCurrentStep(2);
    }
  };

  const handleFile = (selectedFile: File) => {
    const allowedTypes = ["application/pdf", "text/csv", "application/vnd.ms-excel"];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF or CSV file");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      onUploadStart();
      setCurrentStep(3);
      
      // In a real app, you would upload the file to the backend
      const data = await api.uploadBankStatement(file);
      
      toast.success("File uploaded successfully!");
      onUploadSuccess(data);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setCurrentStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-8 text-center">How It Works</h2>
        
        <div className="relative">
          {/* Progress Bar */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-gray-200 z-0">
            <div 
              className="h-1 bg-blue-500 transition-all duration-300" 
              style={{ width: currentStep === 1 ? '10%' : currentStep === 2 ? '50%' : '100%' }}
            ></div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between">
            <div className={`upload-process-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="upload-process-icon">
                <File className="h-6 w-6" />
                <span className="step-number">1</span>
              </div>
              <h3 className="text-lg font-medium mt-2">Export Statement</h3>
              <p className="text-sm text-gray-500">Download your bank statement as PDF/CSV</p>
              <div className="upload-process-visual">
                <svg className="h-20 w-20 mx-auto" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1" className="text-gray-300" />
                  <path d="M7 7h10M7 11h10M7 15h7" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                </svg>
              </div>
            </div>
            
            <div className={`upload-process-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="upload-process-icon">
                <UploadCloud className="h-6 w-6" />
                <span className="step-number">2</span>
              </div>
              <h3 className="text-lg font-medium mt-2">Upload File</h3>
              <p className="text-sm text-gray-500">Drag & drop or select your file</p>
              <div className="upload-process-visual">
                <svg className="h-20 w-20 mx-auto" viewBox="0 0 24 24" fill="none">
                  <path d="M12 18v-12M7 11l5-5 5 5" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" />
                  <path d="M4 18h16" stroke="currentColor" strokeWidth="1.5" className="text-gray-300" />
                </svg>
              </div>
            </div>
            
            <div className={`upload-process-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="upload-process-icon">
                <BarChart className="h-6 w-6" />
                <span className="step-number">3</span>
              </div>
              <h3 className="text-lg font-medium mt-2">View Insights</h3>
              <p className="text-sm text-gray-500">Get financial analytics and reports</p>
              <div className="upload-process-visual">
                <svg className="h-20 w-20 mx-auto" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h3l3-9 4 18 3-12h5" stroke="currentColor" strokeWidth="1.5" className={currentStep >= 3 ? 'text-blue-500' : 'text-gray-300'} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div
          className={`drag-area flex flex-col items-center justify-center h-64 ${isDragging ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {!file ? (
            <>
              <UploadCloud className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">Drag & Drop Your Bank Statement</h3>
              <p className="text-gray-500 mb-3">or click to browse (PDF or CSV)</p>
              <Button variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                Select File
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <FileText className="h-10 w-10 text-finance-blue mb-4" />
              <h3 className="text-lg font-medium mb-1">{file.name}</h3>
              <p className="text-gray-500 mb-3">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="flex space-x-3">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                >
                  <X className="mr-1 h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.csv"
            onChange={handleFileInputChange}
            ref={fileInputRef}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading} 
          className="w-full max-w-md bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
        >
          {uploading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⏳</span> Processing...
            </span>
          ) : (
            <span className="flex items-center">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload and Analyze
            </span>
          )}
        </Button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center">
        <HelpCircle className="h-4 w-4 mr-1" />
        <span>Your data is processed securely and never shared with third parties</span>
      </div>
    </div>
  );
};

export default FileUpload;
