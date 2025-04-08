
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/FileUpload";
import { 
  Loader2, 
  PiggyBank, 
  ChartBar, 
  TrendingUp, 
  Upload, 
  Shield, 
  Lock, 
  Zap, 
  BarChart3, 
  PieChart, 
  LineChart, 
  ArrowRight 
} from "lucide-react";
import { DashboardData } from "@/types";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUploadStart = () => {
    setUploading(true);
  };

  const handleUploadSuccess = (data: DashboardData) => {
    navigate('/dashboard', { state: { dashboardData: data } });
    setUploading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <PiggyBank className="h-10 w-10 mr-3" />
              <div>
                <h1 className="text-4xl font-bold">FinView</h1>
                <p className="text-blue-100">Financial Statement Explorer</p>
              </div>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#how-it-works" className="hover:text-blue-200 transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-blue-200 transition-colors">Features</a></li>
                <li><a href="#demo" className="hover:text-blue-200 transition-colors">Demo</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100">
        {uploading ? (
          <div className="container mx-auto py-16 px-4">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
              <h2 className="text-xl font-medium mb-2">Processing Your Statement...</h2>
              <p className="text-gray-500">This may take a moment as we analyze your data</p>
            </div>
          </div>
        ) : (
          <div className="space-y-24 pb-16">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    <span className="inline-block">📊</span> Understand Your Spending in Seconds
                  </h1>
                  <p className="text-xl text-gray-600">
                    Upload your bank statement and get powerful insights about your expenses.
                    Transform raw financial data into actionable intelligence.
                  </p>
                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => document.getElementById('upload-section')?.scrollIntoView({behavior: 'smooth'})}
                    >
                      Upload Statement <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute top-0 -right-4 w-24 h-24 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80" 
                      alt="Financial dashboard" 
                      className="rounded-lg shadow-2xl border border-gray-200"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-600 font-medium">Real-time insights</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-white py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-10">
                  {[
                    {
                      icon: <Upload className="w-12 h-12 text-blue-500" />,
                      title: "Upload Statement",
                      description: "Simply upload your bank statement file in supported formats (CSV, PDF, Excel)",
                      step: 1
                    },
                    {
                      icon: <BarChart3 className="w-12 h-12 text-blue-500" />,
                      title: "Data Processing",
                      description: "Our AI analyzes your transactions and organizes them into meaningful categories",
                      step: 2
                    },
                    {
                      icon: <PieChart className="w-12 h-12 text-blue-500" />,
                      title: "View Insights",
                      description: "Explore your personalized dashboard with visualizations and spending patterns",
                      step: 3
                    }
                  ].map((item, index) => (
                    <div key={index} className="relative">
                      <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 h-full transition-transform hover:-translate-y-2 duration-300">
                        <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {item.step}
                        </div>
                        {item.icon}
                        <h3 className="text-xl font-bold mt-6 mb-3">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                      {index < 2 && (
                        <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2">
                          <ArrowRight className="w-10 h-10 text-blue-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Why Use This Tool Section */}
            <section id="features" className="container mx-auto px-4 py-16">
              <h2 className="text-4xl font-bold text-center mb-4">Why Use FinView?</h2>
              <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                Our financial analysis tool provides insights that help you make better decisions with your money
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: <Zap className="w-10 h-10 text-amber-500" />,
                    title: "Fast & Secure",
                    description: "Process statements in seconds with bank-level security"
                  },
                  {
                    icon: <ChartBar className="w-10 h-10 text-blue-500" />,
                    title: "Smart Insights",
                    description: "Get AI-powered recommendations tailored to your spending"
                  },
                  {
                    icon: <Lock className="w-10 h-10 text-green-600" />,
                    title: "Privacy-Focused",
                    description: "Your data is processed securely and never shared"
                  },
                  {
                    icon: <LineChart className="w-10 h-10 text-purple-500" />,
                    title: "Interactive Graphs",
                    description: "Explore your data with dynamic, responsive visualizations"
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg">
                    <div className="p-2 bg-gray-50 rounded-lg inline-block mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Graph Previews Section */}
            <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-4">Visualize Your Finances</h2>
                <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                  Interactive charts and graphs that make your financial data easy to understand
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-blue-500" />
                        Expense Categories
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        See where your money goes with detailed category breakdowns
                      </p>
                    </div>
                    <img 
                      src="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Pie chart example" 
                      className="w-full h-48 object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                        Monthly Spending
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Track your spending patterns month-over-month
                      </p>
                    </div>
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Bar chart example" 
                      className="w-full h-48 object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <LineChart className="w-5 h-5 mr-2 text-blue-500" />
                        Spending Trends
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Identify patterns and forecast future expenses
                      </p>
                    </div>
                    <img 
                      src="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Line chart example" 
                      className="w-full h-48 object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Demo/Try It Section */}
            <section id="demo" className="container mx-auto px-4 py-16">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="grid md:grid-cols-2 items-center">
                  <div className="p-12 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to analyze your finances?</h2>
                    <p className="text-blue-100 text-lg mb-8">
                      Upload your statement now and get instant insights into your spending patterns.
                    </p>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-blue-50"
                      onClick={() => document.getElementById('upload-section')?.scrollIntoView({behavior: 'smooth'})}
                    >
                      Try It Now
                    </Button>
                  </div>
                  <div className="hidden md:block relative">
                    <img 
                      src="https://images.unsplash.com/photo-1579621970590-9d624316904b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="Financial dashboard preview"
                      className="w-full h-full object-cover"
                      style={{minHeight: "400px"}}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-blue-900/30"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Upload Section */}
            <section id="upload-section" className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Start Your Financial Analysis</h2>
                <p className="text-center text-gray-600 mb-12">
                  Upload your bank statement below to generate your personalized dashboard
                </p>
                <FileUpload
                  onUploadSuccess={handleUploadSuccess}
                  onUploadStart={handleUploadStart}
                />
              </div>
            </section>
          </div>
        )}
      </main>
      
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center mb-4">
                <PiggyBank className="h-8 w-8 mr-2" />
                <span className="text-2xl font-bold">FinView</span>
              </div>
              <p className="text-blue-200 mb-6">
                Your personal financial assistant that helps you make sense of your bank statements.
              </p>
              <p className="text-blue-300 text-sm">
                &copy; {new Date().getFullYear()} FinView - All Rights Reserved
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-blue-200 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#features" className="text-blue-200 hover:text-white transition-colors">Features</a></li>
                <li><a href="#demo" className="text-blue-200 hover:text-white transition-colors">Try It Now</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Security & Privacy</h3>
              <div className="flex items-center mb-3 text-blue-200">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center mb-3 text-blue-200">
                <Lock className="h-5 w-5 mr-2 text-green-400" />
                <span>Your data is never stored</span>
              </div>
              <div className="flex items-center text-blue-200">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                <span>Privacy-first approach</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
