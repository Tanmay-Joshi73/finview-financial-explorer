
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud, FileText, Check, X, HelpCircle } from "lucide-react";
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
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">How to Upload Your Bank Statement</h2>
        
        <div className="space-y-4">
          <div className="upload-instruction">
            <div className="upload-instruction-number">1</div>
            <div className="upload-instruction-text">
              <h3 className="font-medium text-lg">Export Your Statement</h3>
              <p>Log into your online banking portal and download your statement as a PDF or CSV file</p>
            </div>
          </div>
          
          <div className="upload-instruction">
            <div className="upload-instruction-number">2</div>
            <div className="upload-instruction-text">
              <h3 className="font-medium text-lg">Upload Your File</h3>
              <p>Drag and drop the file below or click to browse your files</p>
            </div>
          </div>
          
          <div className="upload-instruction">
            <div className="upload-instruction-number">3</div>
            <div className="upload-instruction-text">
              <h3 className="font-medium text-lg">View Your Insights</h3>
              <p>After uploading, you'll be taken to your personalized financial dashboard</p>
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
              <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
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
          className="w-full max-w-md"
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
