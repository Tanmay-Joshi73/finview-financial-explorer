
import { SpendingSummary } from "@/types";

interface TopVendorsProps {
  summary: SpendingSummary;
}

const TopVendors = ({ summary }: TopVendorsProps) => {
  // Format dollar amount
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
      <h3 className="text-lg font-medium mb-4">Top Spending Locations</h3>
      <div className="space-y-4">
        {summary.topVendors.map((vendor, index) => (
          <div key={vendor.vendor} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center 
                ${index === 0 ? 'bg-finance-blue text-white' : 
                  index === 1 ? 'bg-finance-light-blue text-white' : 
                  index === 2 ? 'bg-finance-green text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {index + 1}
              </div>
              <span className="ml-3 font-medium">{vendor.vendor}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatCurrency(vendor.totalSpent)}</div>
              <div className="text-xs text-gray-500">{vendor.transactionCount} transactions</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopVendors;
