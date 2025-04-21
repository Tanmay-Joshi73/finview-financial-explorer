"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"


import { Upload, FileUp, Check, AlertCircle, FileType, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadStatement } from "@/lib/actions"
import { Progress } from "@/components/ui/progress"

export default function UploadForm() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  // Animation for success confetti
  const [showConfetti, setShowConfetti] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a PDF file")
      }
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Please upload a PDF file")
      }
    }
  }

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 100)

      const formData = new FormData()
      formData.append("file", file)

      await uploadStatement(formData)
      window.location.reload()
      // revalidatePath("/dashboard") // Add this after your upload logic
      clearInterval(progressInterval)
      setUploadProgress(100)
      setSuccess(true)
      setShowConfetti(true)

      // Refresh the page data
      router.refresh()

      // Reset form after success animation
      setTimeout(() => {
        setFile(null)
        setIsUploading(false)
        setUploadProgress(0)
        setSuccess(false)
        setShowConfetti(false)
      }, 3000)
    } catch (err) {
      setError("Failed to upload file. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
      console.error(err)
    }
  }

  // Confetti effect elements
  const Confetti = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              animation: `fall-${i % 3} ${1 + Math.random() * 2}s linear forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899'][i % 4],
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="mb-8 overflow-hidden relative">
      {showConfetti && <Confetti />}
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl text-blue-800 flex items-center">
          <FileType className="h-6 w-6 mr-2 text-blue-600" />
          Upload Bank Statement
        </CardTitle>
        <CardDescription className="text-slate-600">
          Upload your bank statement PDF to analyze your spending patterns and get personalized insights
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div
                ref={dropZoneRef}
                className={`
                  relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${isDragging ? 'scale-105 border-blue-400 bg-blue-50' : ''}
                  ${file ? "border-green-500 bg-green-50/70" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"}
                  ${isUploading ? "opacity-80" : ""}
                `}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center space-y-3 py-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FileUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="max-w-xs break-words">
                      <p className="text-base font-medium text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4 py-8">
                    <div className="p-4 bg-blue-50 rounded-full shadow-sm">
                      <Upload className="h-10 w-10 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-slate-700">
                        Drag and drop your PDF file here
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        or <span className="text-blue-500 font-medium">browse</span> to select file
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mt-6">
                      Supported format: PDF only (Max size: 10MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress 
                  value={uploadProgress} 
                  className="h-2 bg-slate-100" 
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                />
                <p className="text-xs text-center text-slate-500 mt-2">
                  Processing your statement... Please wait
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-appear">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100 animate-appear">
                <Check className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">Statement uploaded and processed successfully!</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={!file || isUploading} 
              className={`w-full transition-all duration-300 mt-4 ${
                file && !isUploading ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-indigo-200' : 'bg-slate-300'
              } text-white py-6`}
            >
              {isUploading ? "Processing..." : success ? "Done!" : "Analyze Statement"}
            </Button>
          </div>
        </form>
      </CardContent>

      <style jsx>{`
        @keyframes fall-0 {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes fall-1 {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(-180deg); }
        }
        @keyframes fall-2 {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(720deg); }
        }
      `}</style>
    </Card>
  )
}