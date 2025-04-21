import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Store, 
  Calendar, 
  DollarSign, 
  BarChart2, 
  PieChart as PieChartIcon,
  RadarIcon,
  ListFilter,
  Info
} from "lucide-react";
// import VendorDetailModal from "./VendorDetailModal";
import VendorDetailModal from "./VendorDetailMode";
// Custom chart tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-lg rounded-md">
        <p className="font-medium text-sm text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex items-center mt-2">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
            <span className="text-sm text-gray-700">{entry.name}: </span>
            <span className="ml-1 text-sm font-medium">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function VendorAnalysis({ data }: { data: any }) {
  const [chartType, setChartType] = useState("bar");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showVendorDetail, setShowVendorDetail] = useState(false);
  
  if (!data || !data.vendorStats) {
    return (
      <Card className="border-none shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Store className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Vendor Data Available</h3>
          <p className="text-gray-500 text-center max-w-md">
            Upload a bank statement to see detailed analysis of your spending by vendor
          </p>
        </CardContent>
      </Card>
    );
  }

  const { vendorStats, monthlyPatterns, timePatterns, dailyPatterns, recentTransactions } = data;

  // Find selected vendor's full data
  const selectedVendorData = selectedVendor ? 
    vendorStats.find((v: any) => v._id === selectedVendor) : null;

  // Get selected vendor's monthly pattern
  const selectedVendorMonthlyData = selectedVendor ?
    monthlyPatterns.find((v: any) => v._id === selectedVendor)?.monthlyBreakdown || [] : [];

  // Get selected vendor's daily pattern
  const selectedVendorDailyData = selectedVendor ?
    dailyPatterns.find((v: any) => v._id === selectedVendor)?.dayWise || [] : [];

  // Get selected vendor's recent transactions
  const selectedVendorTransactions = selectedVendor ?
    recentTransactions.find((v: any) => v._id === selectedVendor)?.recent || [] : [];

  // Top vendors for display (can be adjusted)
  const topVendors = vendorStats.slice(0, 6);

  // Format vendor stats for chart
  const vendorChartData = topVendors.map((vendor: any) => ({
    name: vendor._id,
    total: Number.parseFloat(vendor.totalSpent),
    transactions: vendor.transactionCount,
    average: Number.parseFloat(vendor.avgTransaction),
    frequency: vendor.transactionCount / 30, // Transactions per month approximation
  }));

  // Colors for charts with better palette
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];
  
  // Calculate spending indicators
  const totalSpending = topVendors.reduce((sum: number, vendor: any) => sum + Number.parseFloat(vendor.totalSpent), 0);
  const highestVendor = topVendors[0];
  const mostFrequentVendor = [...topVendors].sort((a, b) => b.transactionCount - a.transactionCount)[0];
  
  // Handle vendor selection
  const handleVendorSelect = (vendor: string) => {
    if (selectedVendor === vendor) {
      // If clicking the same vendor, toggle details modal
      setShowVendorDetail(true);
    } else {
      // If different vendor, select it and show details
      setSelectedVendor(vendor);
      setShowVendorDetail(true);
    }
  };

  // Filter data based on selection
  const displayData = selectedVendor 
    ? vendorChartData.filter(v => v.name === selectedVendor)
    : vendorChartData;

  return (
    <div className="space-y-6">
      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <VendorDetailModal 
          isOpen={showVendorDetail}
          onClose={() => setShowVendorDetail(false)}
          vendorName={selectedVendor}
          vendorData={selectedVendorData}
          recentTransactions={selectedVendorTransactions}
          monthlyData={selectedVendorMonthlyData}
          dailyData={selectedVendorDailyData}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-none shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-indigo-600 font-medium mb-1 text-sm">Total Vendor Spending</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpending)}</h3>
                <p className="text-indigo-900/60 text-xs mt-1">Across {vendorStats.length} vendors</p>
              </div>
              <div className="bg-white p-2 rounded-full shadow-sm">
                <DollarSign className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-none shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-600 font-medium mb-1 text-sm">Highest Spending</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(highestVendor.totalSpent)}</h3>
                <p className="text-emerald-900/60 text-xs mt-1">at {highestVendor._id}</p>
              </div>
              <div className="bg-white p-2 rounded-full shadow-sm">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-none shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-amber-600 font-medium mb-1 text-sm">Most Frequent</p>
                <h3 className="text-2xl font-bold text-gray-900">{mostFrequentVendor.transactionCount} times</h3>
                <p className="text-amber-900/60 text-xs mt-1">at {mostFrequentVendor._id}</p>
              </div>
              <div className="bg-white p-2 rounded-full shadow-sm">
                <Calendar className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Selection */}
      <div className="flex flex-wrap gap-2 mb-4 justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant={chartType === "bar" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartType("bar")}
            className="flex items-center gap-1"
          >
            <BarChart2 className="h-4 w-4" />
            <span>Bar</span>
          </Button>
          <Button 
            variant={chartType === "pie" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartType("pie")}
            className="flex items-center gap-1"
          >
            <PieChartIcon className="h-4 w-4" />
            <span>Pie</span>
          </Button>
          <Button 
            variant={chartType === "radar" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartType("radar")}
            className="flex items-center gap-1"
          >
            <RadarIcon className="h-4 w-4" />
            <span>Radar</span>
          </Button>
        </div>
        
        <div className="flex items-center">
          <ListFilter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600 mr-2">Filter vendor:</span>
          <div className="flex flex-wrap gap-1">
            {topVendors.map((vendor: any, idx: number) => (
              <Badge 
                key={vendor._id} 
                variant={selectedVendor === vendor._id ? "default" : "outline"}
                className="cursor-pointer"
                style={selectedVendor === vendor._id ? { backgroundColor: COLORS[idx % COLORS.length] } : {}}
                onClick={() => handleVendorSelect(vendor._id)}
              >
                {vendor._id}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <Card className="border border-gray-100 shadow-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2 text-gray-700" />
            Vendor Spending Analysis
            {selectedVendor && (
              <Button
                variant="ghost" 
                size="sm" 
                className="ml-2 text-blue-600"
                onClick={() => setShowVendorDetail(true)}
              >
                <Info className="h-4 w-4 mr-1" />
                View Details
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            {selectedVendor 
              ? `Detailed view of your spending at ${selectedVendor}`
              : "Visual breakdown of your spending across top vendors"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Bar 
                    dataKey="total" 
                    name="Total Spent" 
                    radius={[4, 4, 0, 0]}
                    barSize={selectedVendor ? 60 : 30}
                  >
                    {displayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : chartType === "pie" ? (
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={displayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="total"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {displayData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              ) : (
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={displayData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                  <Radar 
                    name="Total Spent" 
                    dataKey="total" 
                    stroke="#4F46E5" 
                    fill="#4F46E5" 
                    fillOpacity={0.5} 
                  />
                  <Radar 
                    name="Frequency" 
                    dataKey="frequency" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.5} 
                  />
                  <Legend />
                  <Tooltip formatter={(value: number, name: string) => [
                    name === "Frequency" ? value.toFixed(2) + " tx/month" : formatCurrency(value),
                    name
                  ]} />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100 shadow-md">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-gray-700" />
              Vendor Details
            </CardTitle>
            <CardDescription>Financial breakdown by vendor</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Total Spent</TableHead>
                    <TableHead className="font-semibold">Transactions</TableHead>
                    <TableHead className="font-semibold">Avg. Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topVendors.map((vendor: any, idx: number) => (
                    <TableRow 
                      key={vendor._id}
                      className={`${
                        selectedVendor === vendor._id ? 'bg-blue-50' : ''
                      } hover:bg-gray-50 cursor-pointer transition-colors`}
                      onClick={() => handleVendorSelect(vendor._id)}
                    >
                      <TableCell className="font-medium flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        {vendor._id}
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(vendor.totalSpent)}</TableCell>
                      <TableCell>{vendor.transactionCount}</TableCell>
                      <TableCell>{formatCurrency(vendor.avgTransaction)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-md">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-700" />
              Transaction Timeline
            </CardTitle>
            <CardDescription>First and last transaction with each vendor</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">First Transaction</TableHead>
                    <TableHead className="font-semibold">Last Transaction</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topVendors.map((vendor: any, idx: number) => {
                    const first = new Date(vendor.firstTransaction);
                    const last = new Date(vendor.lastTransaction);
                    const durationDays = Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <TableRow 
                        key={vendor._id}
                        className={`${
                          selectedVendor === vendor._id ? 'bg-blue-50' : ''
                        } hover:bg-gray-50 cursor-pointer transition-colors`}
                        onClick={() => handleVendorSelect(vendor._id)}
                      >
                        <TableCell className="font-medium flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          {vendor._id}
                        </TableCell>
                        <TableCell>{formatDate(vendor.firstTransaction)}</TableCell>
                        <TableCell>{formatDate(vendor.lastTransaction)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50">
                            {durationDays} days
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Optional Insights Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Top Vendor</h4>
              <p className="text-xl font-bold">{highestVendor._id}</p>
              <p className="text-sm text-gray-500">{((Number.parseFloat(highestVendor.totalSpent) / totalSpending) * 100).toFixed(1)}% of your spending</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Most Frequent Visits</h4>
              <p className="text-xl font-bold">{mostFrequentVendor._id}</p>
              <p className="text-sm text-gray-500">Visited {mostFrequentVendor.transactionCount} times</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Spending Diversity</h4>
              <p className="text-xl font-bold">{vendorStats.length} vendors</p>
              <p className="text-sm text-gray-500">Avg. {formatCurrency(totalSpending / vendorStats.length)} per vendor</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}