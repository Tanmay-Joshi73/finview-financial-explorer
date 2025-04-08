
import { SpendingSummary } from "@/types";
import { Clock, Building, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopVendorsProps {
  summary: SpendingSummary;
  onVendorSelect?: (vendor: string) => void;
}

const TopVendors = ({ summary, onVendorSelect }: TopVendorsProps) => {
  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  // Get time of day with most transactions (mock data for demonstration)
  const peakTimings = [
    { time: "Morning (6-10 AM)", percentage: 35 },
    { time: "Afternoon (11-3 PM)", percentage: 25 },
    { time: "Evening (4-8 PM)", percentage: 30 },
    { time: "Night (9 PM-5 AM)", percentage: 10 }
  ];
  
  const mostActiveTime = peakTimings.reduce((prev, current) => 
    (prev.percentage > current.percentage) ? prev : current
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-500" />
            Top Spending Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.topVendors.map((vendor, index) => (
              <div 
                key={vendor.vendor} 
                className={`flex items-center justify-between ${onVendorSelect ? 'cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors' : ''}`}
                onClick={() => onVendorSelect && onVendorSelect(vendor.vendor)}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center 
                    ${index === 0 ? 'bg-blue-600 text-white' : 
                      index === 1 ? 'bg-blue-500 text-white' : 
                      index === 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-3 font-medium">{vendor.vendor}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold flex items-center justify-end">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {formatCurrency(vendor.totalSpent).replace('₹', '')}
                  </div>
                  <div className="text-xs text-gray-500">{vendor.transactionCount} transactions</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Peak Transaction Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {peakTimings.map((timing) => (
              <div key={timing.time} className="flex items-center justify-between">
                <span className={`${timing.time === mostActiveTime.time ? 'font-medium' : ''}`}>
                  {timing.time}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className={`h-2.5 rounded-full ${timing.time === mostActiveTime.time ? 'bg-blue-600' : 'bg-blue-400'}`}
                      style={{ width: `${timing.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{timing.percentage}%</span>
                </div>
              </div>
            ))}
            <div className="pt-2 text-sm text-blue-600 font-medium">
              Most transactions happen in the {mostActiveTime.time.split(' ')[0].toLowerCase()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopVendors;
