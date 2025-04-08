
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
  ArrowRight,
  CheckCircle,
  CreditCard,
  Wallet,
  LayoutDashboard
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
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <PiggyBank className="h-10 w-10 mr-3 glow" />
              <div>
                <h1 className="text-4xl font-bold tracking-tighter">FinView</h1>
                <p className="text-blue-100">Smart Financial Analysis</p>
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
      
      <main className="flex-1">
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
            {/* Hero Section with Money Graphic */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-blue-800 py-20 text-white">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('public/lovable-uploads/120a39aa-391e-4ced-b4d5-5e9d94d664ed.png')] bg-center bg-no-repeat bg-cover mix-blend-overlay"></div>
              </div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-700/30 border border-blue-500/20 text-blue-200 font-medium text-sm mb-2">
                      Financial Intelligence
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight gradient-text bg-gradient-to-r from-white to-blue-200">
                      Transform Your Financial Data Into Insights
                    </h1>
                    <p className="text-xl text-blue-100">
                      Upload your bank statements and discover spending patterns, track expenses, 
                      and make smarter financial decisions with AI-powered analysis.
                    </p>
                    <div className="pt-4 flex gap-4">
                      <Button 
                        size="lg" 
                        className="text-lg px-8 py-6 bg-gradient-to-r from-finance-purple to-finance-blue hover:from-finance-blue hover:to-finance-purple rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => document.getElementById('upload-section')?.scrollIntoView({behavior: 'smooth'})}
                      >
                        Get Started <ArrowRight className="ml-2" />
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        className="text-lg px-8 py-6 bg-transparent border-2 border-white/20 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})}
                      >
                        Learn More
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-blue-200 mt-4">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Bank-level encryption</span>
                      <CheckCircle className="h-4 w-4 text-green-400 ml-4" />
                      <span>100% free</span>
                      <CheckCircle className="h-4 w-4 text-green-400 ml-4" />
                      <span>Privacy-first</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-0 -right-4 w-24 h-24 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    <div className="relative">
                      <div className="hero-image-container animate-float">
                        <img 
                          src="public/lovable-uploads/318cdad4-e990-430e-adac-083f47d61c5e.png" 
                          alt="Financial dashboard" 
                          className="rounded-lg shadow-2xl w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg animate-float-delay-2">
                        <div className="flex items-center">
                          <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-green-600 font-medium">Real-time insights</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Floating Transaction Cards */}
            <section className="container mx-auto px-4 -mt-24">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="public/lovable-uploads/38b9e43a-e76b-4fad-96cc-d94e292c41db.png" 
                    alt="Payment receipt" 
                    className="w-full h-auto rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="glass-card rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 md:mt-12">
                  <img 
                    src="public/lovable-uploads/cfca62d3-65b1-4c43-986f-69ff01ab9d9c.png" 
                    alt="Financial analytics dashboard" 
                    className="w-full h-auto rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="glass-card rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="public/lovable-uploads/0e369468-efeb-483c-8318-841946f046d3.png" 
                    alt="Mobile banking" 
                    className="w-full h-auto rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            {/* Statistics Section */}
            <section className="bg-gray-50 py-20">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Make Sense of Your Financial Data
                  </h2>
                  <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
                    Our platform processes your transactions to provide clear insights into your spending habits
                  </p>
                </div>
                
                <div className="grid md:grid-cols-4 gap-8">
                  {[
                    { value: "95%", label: "Accuracy Rate", icon: <CheckCircle className="text-green-500" /> },
                    { value: "2min", label: "Average Processing Time", icon: <Zap className="text-yellow-500" /> },
                    { value: "100+", label: "Banks Supported", icon: <CreditCard className="text-blue-500" /> },
                    { value: "50k+", label: "Satisfied Users", icon: <Wallet className="text-purple-500" /> }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                      <div className="p-3 bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        {stat.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="container mx-auto px-4 py-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600">
                  How It Works
                </h2>
                <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
                  Three simple steps to transform your financial statements into actionable insights
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-10">
                {[
                  {
                    icon: <Upload className="w-12 h-12 text-blue-500" />,
                    title: "Upload Your Statement",
                    description: "Simply drag and drop your bank statement file in any common format",
                    image: "public/lovable-uploads/120a39aa-391e-4ced-b4d5-5e9d94d664ed.png",
                    step: 1
                  },
                  {
                    icon: <BarChart3 className="w-12 h-12 text-purple-500" />,
                    title: "AI Analysis",
                    description: "Our advanced algorithms categorize and analyze all your transactions",
                    image: "public/lovable-uploads/318cdad4-e990-430e-adac-083f47d61c5e.png",
                    step: 2
                  },
                  {
                    icon: <LayoutDashboard className="w-12 h-12 text-green-500" />,
                    title: "Interactive Dashboard",
                    description: "Explore your personalized financial dashboard with detailed insights",
                    image: "public/lovable-uploads/cfca62d3-65b1-4c43-986f-69ff01ab9d9c.png",
                    step: 3
                  }
                ].map((item, index) => (
                  <div key={index} className="step-card animated-card">
                    <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="p-4 bg-blue-50 rounded-full mb-6">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-gray-600 mb-6">{item.description}</p>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="rounded-lg shadow-md w-full h-48 object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    {index < 2 && (
                      <div className="hidden md:flex absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-10 h-10 text-blue-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-gradient-to-b from-blue-50 to-white py-20">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-4 gradient-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Powerful Features
                </h2>
                <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
                  Our financial analysis tool provides insights that help you make better decisions with your money
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <PieChart className="w-10 h-10 text-blue-500" />,
                      title: "Expense Categorization",
                      description: "Automatically categorize your expenses into meaningful groups",
                      color: "bg-blue-50"
                    },
                    {
                      icon: <TrendingUp className="w-10 h-10 text-green-500" />,
                      title: "Spending Trends",
                      description: "Track your spending patterns over time to identify saving opportunities",
                      color: "bg-green-50"
                    },
                    {
                      icon: <ChartBar className="w-10 h-10 text-purple-500" />,
                      title: "Budget Analysis",
                      description: "Compare actual spending against your budget to stay on track",
                      color: "bg-purple-50"
                    },
                    {
                      icon: <Zap className="w-10 h-10 text-amber-500" />,
                      title: "Real-time Processing",
                      description: "Get insights instantly with our high-speed analysis engine",
                      color: "bg-amber-50"
                    },
                    {
                      icon: <Lock className="w-10 h-10 text-red-500" />,
                      title: "Bank-Level Security",
                      description: "Your financial data is protected with enterprise-grade encryption",
                      color: "bg-red-50"
                    },
                    {
                      icon: <LayoutDashboard className="w-10 h-10 text-indigo-500" />,
                      title: "Custom Dashboards",
                      description: "Create personalized views focused on what matters most to you",
                      color: "bg-indigo-50"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className={`p-4 ${feature.color} rounded-xl inline-block mb-4`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Visualization Preview Section */}
            <section className="container mx-auto px-4 py-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Visualize Your Finances
                </h2>
                <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
                  Our interactive charts make it easy to understand your spending habits
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Spending Categories</h3>
                    <p className="text-gray-600 mb-6">See where your money goes with detailed category breakdowns</p>
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src="public/lovable-uploads/318cdad4-e990-430e-adac-083f47d61c5e.png"
                        alt="Financial chart visualization" 
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Transaction Analytics</h3>
                    <p className="text-gray-600 mb-6">Analyze your transaction patterns to make better financial decisions</p>
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src="public/lovable-uploads/cfca62d3-65b1-4c43-986f-69ff01ab9d9c.png"
                        alt="Transaction analytics" 
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action Section */}
            <section id="demo" className="container mx-auto px-4 py-16">
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid md:grid-cols-2 items-center">
                  <div className="p-12 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to analyze your finances?</h2>
                    <p className="text-blue-100 text-lg mb-8">
                      Upload your statement now and get instant insights into your spending patterns.
                    </p>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => document.getElementById('upload-section')?.scrollIntoView({behavior: 'smooth'})}
                    >
                      Upload Statement
                    </Button>
                  </div>
                  <div className="hidden md:block relative h-full">
                    <img 
                      src="public/lovable-uploads/0e369468-efeb-483c-8318-841946f046d3.png"
                      alt="Financial dashboard preview"
                      className="w-full h-full object-cover"
                      style={{minHeight: "400px"}}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-900/40"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Upload Section */}
            <section id="upload-section" className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
                <h2 className="text-3xl font-bold text-center mb-4 gradient-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Start Your Financial Analysis
                </h2>
                <p className="text-center text-gray-600 mb-12 max-w-lg mx-auto">
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
      
      <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <PiggyBank className="h-8 w-8 mr-2 text-blue-300" />
                <span className="text-2xl font-bold gradient-text bg-gradient-to-r from-blue-300 to-white">FinView</span>
              </div>
              <p className="text-blue-200 mb-6 max-w-md">
                Your personal financial assistant that helps you make sense of your bank statements and take control of your finances.
              </p>
              <p className="text-blue-300 text-sm">
                &copy; {new Date().getFullYear()} FinView - All Rights Reserved
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="#how-it-works" className="text-blue-200 hover:text-white transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> How It Works</a></li>
                <li><a href="#features" className="text-blue-200 hover:text-white transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Features</a></li>
                <li><a href="#demo" className="text-blue-200 hover:text-white transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Try It Now</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Security & Privacy</h3>
              <div className="flex items-center mb-4 text-blue-200">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center mb-4 text-blue-200">
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
