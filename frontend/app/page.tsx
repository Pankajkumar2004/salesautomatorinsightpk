'use client'

import { useState } from 'react'
import { Upload, Mail, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [summary, setSummary] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const fileType = selectedFile.name.toLowerCase()
      if (fileType.endsWith('.csv') || fileType.endsWith('.xlsx')) {
        setFile(selectedFile)
        setStatus('idle')
        setMessage('')
        setSummary('')
      } else {
        setStatus('error')
        setMessage('Please upload a CSV or XLSX file')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !email) {
      setStatus('error')
      setMessage('Please provide both file and email address')
      return
    }

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('email', email)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/upload-and-process`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || 'secure-token-123'}`
          },
          timeout: 120000 // 2 minutes timeout
        }
      )

      setStatus('success')
      setMessage('Sales data processed successfully! Summary sent to your email.')
      setSummary(response.data.summary)
      
    } catch (error: any) {
      setStatus('error')
      setMessage(error.response?.data?.detail || 'Processing failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sales Data Automator
          </h1>
          <p className="text-xl text-gray-600">
            Upload your sales data and receive AI-powered insights via email
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Sales Data
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-400 focus:outline-none"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload CSV or XLSX file'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Email Input Section */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file || !email}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Process & Send Report'
              )}
            </button>
          </form>

          {/* Status Messages */}
          {status !== 'idle' && (
            <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${
              status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {status === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-sm mt-1">{message}</p>
              </div>
            </div>
          )}

          {/* Summary Display */}
          {summary && status === 'success' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">AI-Generated Summary</h3>
              </div>
              <div className="bg-white p-4 rounded border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {summary}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600 text-sm">
              Simply upload your CSV or Excel files with sales data
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI generates professional insights and recommendations
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Delivery</h3>
            <p className="text-gray-600 text-sm">
              Receive comprehensive reports directly in your inbox
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
