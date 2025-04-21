import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  ClockIcon, 
  ArrowDownIcon, 
  ReceiptIcon
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface VendorTransactionProps {
  transaction: {
    amount: number;
    date: string;
  };
  vendorName: string;
}

interface VendorTransactionsListProps {
  transactions: Array<{
    amount: number;
    date: string;
  }>;
  vendorName: string;
}

// Individual transaction component
export const VendorTransaction: React.FC<VendorTransactionProps> = ({ 
  transaction, 
  vendorName 
}) => {
  // Determine styling based on transaction amount
  const getAmountColor = (amount: number) => {
    if (amount > 500) return 'text-red-600';
    if (amount > 200) return 'text-orange-500';
    if (amount > 50) return 'text-blue-600';
    return 'text-green-600';
  };

  const getAmountBackground = (amount: number) => {
    if (amount > 500) return 'bg-red-50';
    if (amount > 200) return 'bg-orange-50';
    if (amount > 50) return 'bg-blue-50';
    return 'bg-green-50';
  };

  const date = new Date(transaction.date);
  const formattedTime = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <Card className={`${getAmountBackground(transaction.amount)} border-none shadow-sm hover:shadow-md transition-all duration-200`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-sm">
              <ReceiptIcon className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{vendorName}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>{formatDate(transaction.date)}</span>
                <span className="mx-2">•</span>
                <ClockIcon className="h-3 w-3 mr-1" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`font-bold text-lg ${getAmountColor(transaction.amount)}`}>
              {formatCurrency(transaction.amount)}
            </span>
            <Badge variant="outline" className="text-xs mt-1">
              <ArrowDownIcon className="h-3 w-3 mr-1" />
              Debit
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// List of transactions component
export const VendorTransactionsList: React.FC<VendorTransactionsListProps> = ({
  transactions,
  vendorName
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <ReceiptIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No transactions found for this vendor.</p>
      </div>
    );
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction, index) => (
        <VendorTransaction 
          key={`${transaction.date}-${index}`}
          transaction={transaction}
          vendorName={vendorName}
        />
      ))}
    </div>
  );
};

export default VendorTransactionsList;