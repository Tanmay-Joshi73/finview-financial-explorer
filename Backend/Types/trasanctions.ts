export interface PaidToWho {
  name: string;
  time: string; // Format: "08:00 AM"
  Amount: string; // String representation of number
  Weekend: boolean;
}

export interface Transaction {
  _id: string;
  month: string;
  Date: string; // ISO format
  Paid_To_Who: PaidToWho;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeminiPrediction {
  weeklyPrediction: number;
  monthlyPrediction: number;
  confidence: number;
  insights: string[];
  keyPatterns: {
    frequentAmounts: number[];
    commonTimes: string[];
    weekendRatio: number;
  };
}