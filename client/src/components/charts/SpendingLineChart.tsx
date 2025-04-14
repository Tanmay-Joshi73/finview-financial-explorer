
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Transaction } from '@/types';

interface SpendingLineChartProps {
  transactions: Transaction[];
  month: string;
}

const SpendingLineChart = ({ transactions, month }: SpendingLineChartProps) => {
  // Process transaction data for the chart
  const chartData = transactions
    .filter(tx => tx.month === month)
    .map(tx => {
      const date = new Date(tx.Date);
      return {
        day: date.getDate(),
        amount: parseFloat(tx.Amount),
      };
    })
    .sort((a, b) => a.day - b.day)
    .reduce((acc, curr) => {
      const existingDay = acc.find(item => item.day === curr.day);
      if (existingDay) {
        existingDay.amount += curr.amount;
      } else {
        acc.push({ day: curr.day, amount: curr.amount });
      }
      return acc;
    }, [] as { day: number; amount: number }[]);

  // Calculate average spending for reference line
  const average = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.amount, 0) / chartData.length 
    : 0;

  // Format for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="h-72 w-full">
      <h3 className="text-lg font-medium mb-2">Daily Spending - {month}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="day" 
            label={{ value: 'Day of Month', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => [formatCurrency(value as number), 'Spent']} />
          <ReferenceLine 
            y={average} 
            label={{ value: 'Average', position: 'right' }} 
            stroke="#8884d8" 
            strokeDasharray="3 3" 
          />
          <Line
            type="monotone"
            dataKey="amount"
            name="Amount Spent"
            stroke="#00c853"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingLineChart;
