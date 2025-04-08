
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategorySpending } from '@/types';

interface ExpenseDonutChartProps {
  data: CategorySpending[];
}

const COLORS = ['#1a73e8', '#4285f4', '#00c853', '#69F0AE', '#d32f2f', '#ffd600'];

const ExpenseDonutChart = ({ data }: ExpenseDonutChartProps) => {
  // Format for tooltip
  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="h-72 w-full">
      <h3 className="text-lg font-medium mb-2">Spending by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={50}
            paddingAngle={3}
            dataKey="amount"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatTooltip} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseDonutChart;
