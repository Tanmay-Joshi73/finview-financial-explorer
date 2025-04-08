
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
  color?: "default" | "green" | "blue" | "red" | "yellow";
}

const ExpenseCard = ({
  title,
  value,
  icon,
  trend,
  className,
  onClick,
  color = "default"
}: ExpenseCardProps) => {
  const colorClasses = {
    default: "",
    green: "border-l-4 border-finance-green",
    blue: "border-l-4 border-finance-blue",
    red: "border-l-4 border-finance-red",
    yellow: "border-l-4 border-finance-yellow",
  };

  return (
    <div
      className={cn(
        "stat-card",
        colorClasses[color],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs. last month</span>
            </div>
          )}
        </div>
        
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
};

export default ExpenseCard;
