
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { MonthlySpending } from '@/types';

interface MonthlyBarChartProps {
  data: MonthlySpending[];
  onMonthSelect: (month: string) => void;
  selectedMonth?: string;
}

const MonthlyBarChart = ({ 
  data, 
  onMonthSelect, 
  selectedMonth 
}: MonthlyBarChartProps) => {
  // Format for tooltip and axis
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-72 w-full">
      <h3 className="text-lg font-medium mb-2">Monthly Spending</h3>
      <p className="text-sm text-gray-500 mb-3">Click on a month to see detailed transactions</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => [formatCurrency(value as number), 'Total Spent']} />
          <Bar 
            dataKey="totalSpent" 
            name="Total Spent"
            fill="#4285f4" 
            radius={[4, 4, 0, 0]} 
            onClick={(data) => onMonthSelect(data.month)}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
