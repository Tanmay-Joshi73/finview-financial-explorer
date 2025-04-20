import  {Request,Response} from "express"
import fs from 'fs'
import { ProcessFile } from "./ProcessFunction.js";
import {Multer} from "multer"
import { Csv_Convertor,InsertData} from "./ProcessFunction.js";
import Transactions_Collection from "../Models/trasanctions.js";
import mongoose, { PipelineStage } from "mongoose";
import { Transaction } from '../Types/trasanctions.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyDX1fM7wDiYu5BILjzRzho71PWVpngORso');
import { ResponseException } from "pdfjs-dist";
import { processTransactions } from "./ProcessFunction.js";
import { sum } from "pdf-lib";
export const  Process=async(req:Request,res:Response)=>{
    if(!req.file){
        res.send("Given file is not uploaded Please upload the given file")
    }
const filePath:Express.Multer.File| undefined=req.file;

const data=await ProcessFile(filePath)

if(!fs.existsSync('./exports')){
    console.log('hey i am inside the given function call')
   fs.mkdirSync('../exports')
}

const CsvPath='./exports/trasanctions.csv'
Csv_Convertor(data,CsvPath)
InsertData(data)
}


export const FetchData=async(req:Request,res:Response):Promise<void>=>{
    const data=await Transactions_Collection.find()
    console.log(data)
  }

export const ProcessData=async(Req:Request,Res:Response):Promise<any>=>{
    const pipeline = [
        {
            $addFields: {
                amount: { $toDouble: "$Paid_To_Who.Amount" },
                vendor: "$Paid_To_Who.name",
                hour: { $hour: "$Date" },
                monthName:"$month",
                clock:"$Paid_To_Who.time",
                timeBlock: {
                    $concat: [
                      { $toString: { $floor: { $divide: ["$clock", 2] } } },
                      "-",
                      { $toString: { $add: [{ $floor: { $divide: ["$clock", 2] } }, 2] } }
                    ]
                  }
            }
        },
        {
            $facet: {
                TotalSpent: [
                    {
                        $group: {
                            _id: null,
                            Total: { $sum: "$amount" }
                        }
                    }
                ],
                Month:[
                    {
                    $group:{
                        _id:"$month",
                        MonthSpending:{$sum:"$amount"},
                        TotalTransaction:{$sum:1}
                    }
                }
            ],
            TopVendor:[
                {
                    $group:{
                        _id:"$vendor",
                        VendorSpending:{$sum:"$amount"},
                        TransactionCount:{$sum:1}
                    }
                },
                {
                    $sort: { "VendorSpending": -1 as const } // TypeScript needs this exact syntax
                  },
                {
                    $limit:5
                }      
            ],
           
            // PeakHours: [
            //     {
            //       $group: {
            //         _id: "$clock",
            //         transactionCount: { $sum: 1 },
            //         totalAmount: { $sum: "$amount" }
            //       }
            //     },
            //     { $sort: {"transactionCount": -1 as  const } },
            //     { $limit: 3 },
            //     {
            //       $project: {
            //         hourRange: {
            //           $concat: [
            //             { $toString: "$_id" },
            //             ":00-",
            //             { $toString: { $add: ["$_id", 1] } },
            //             ":00"
            //           ]
            //         },
            //         transactionCount: 1,
            //         totalAmount: 1,
            //         _id: 0
            //       }
            //     }
            //   ],
            }
        }
    ];
    const result=await Transactions_Collection.aggregate(pipeline)
    // const totalAmount = result[0].MonthSpending[0];
    console.log(result[0])
}

export const VendorsData=async(req:Request,res:Response):Promise<any>=>{
  const vendorAnalyticsPipeline: PipelineStage[] = [
    // Stage 1: Filter and prepare data
    {
      $match: {
        "Paid_To_Who.name": { $exists: true, $ne: null },
        "Paid_To_Who.Amount": { $exists: true, $ne: null }
      }
    },
    // Stage 2: Convert and add fields
    {
      $addFields: {
        amount: {
          $convert: {
            input: "$Paid_To_Who.Amount",
            to: "double",
            onError: 0,
            onNull: 0
          }
        },
        vendor: "$Paid_To_Who.name",
        date: "$Date",
        month: { $month: "$Date" },
        hour: { $hour: "$Date" }
      }
    },
    // Stage 3: Main vendor analytics
    {
      $facet: {
        // Basic vendor stats
        vendorStats: [
          {
            $group: {
              _id: "$vendor",
              totalSpent: { $sum: "$amount" },
              transactionCount: { $sum: 1 },
              avgTransaction: { $avg: "$amount" },
              firstTransaction: { $min: "$date" },
              lastTransaction: { $max: "$date" }
            }
          },
          { $sort: { totalSpent: -1 } }
        ],
        
        // Monthly spending patterns
        monthlyPatterns: [
          {
            $group: {
              _id: {
                vendor: "$vendor",
                month: "$month"
              },
              monthlyTotal: { $sum: "$amount" },
              transactionCount: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: "$_id.vendor",
              monthlyBreakdown: {
                $push: {
                  month: "$_id.month",
                  total: "$monthlyTotal",
                  count: "$transactionCount"
                }
              }
            }
          }
        ],
        
        // Time-of-day patterns
        timePatterns: [
          {
            $bucket: {
              groupBy: "$hour",
              boundaries: [0, 6, 12, 18, 24],
              default: "Other",
              output: {
                vendors: { $push: "$vendor" },
                amounts: { $push: "$amount" },
                count: { $sum: 1 }
              }
            }
          }
        ],
        
        // Recent activity
        recentActivity: [
          { $sort: { date: -1 } },
          {
            $group: {
              _id: "$vendor",
              mostRecent: { $first: "$date" },
              recentAmount: { $first: "$amount" }
            }
          },
          { $limit: 10 }
        ]
      }
    },
    // Stage 4: Combine and format results
    {
      $project: {
        vendorStats: 1,
        monthlyPatterns: {
          $map: {
            input: "$vendorStats",
            as: "vendor",
            in: {
              vendor: "$$vendor._id",
              stats: "$$vendor",
              monthlyData: {
                $filter: {
                  input: "$monthlyPatterns",
                  as: "monthly",
                  cond: { $eq: ["$$monthly._id", "$$vendor._id"] }
                }
              }
            }
          }
        },
        timePatterns: 1,
        recentActivity: 1
      }
    }
  ];

const Result=await Transactions_Collection.aggregate(vendorAnalyticsPipeline)
console.log(JSON.stringify(Result))
}


type Prediction_Transaction = {
  month: string;
  Date: Date;
  Paid_To_Who: {
    name: string;
    time: string;
    Amount: string;
    Weekend: boolean;
  };
};
// Type Definitions
type CategoryMetrics = {
  count: number;
  total: number;
  avgPerTransaction: number;
};

type TimeMetrics = {
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
};

type DayMetrics = {
  weekday: number;
  weekend: number;
  avgWeekday: number;
  avgWeekendDay: number;
};

type MonthlyTrend = {
  total: number;
  count: number;
  avgPerDay: number;
};

type UPIMetrics = {
  byCategory: Record<string, CategoryMetrics>;
  byTime: TimeMetrics;
  byDay: DayMetrics;
  largeTransactions: number;
  monthlyTrends: Record<string, MonthlyTrend>;
};

type PredictionRange = {
  min: number;
  max: number;
};

type CategoryPrediction = {
  category: string;
  expectedAmount: number;
  percentage: number;
};

type Prediction = {
  monthly: {
    estimatedTotal: PredictionRange;
    primaryCategories: CategoryPrediction[];
    confidence: "low" | "medium" | "high";
  };
  weekly: {
    weekendEstimate: PredictionRange;
    weekdayEstimate: PredictionRange;
    confidence: "low" | "medium" | "high";
  };
};

type Insights = {
  topPatterns: string[];
  riskFactors: string[];
};

type Recommendations = {
  immediate: string[];
  longTerm: string[];
};

type PredictionResponse = {
  predictions: Prediction;
  insights: Insights;
  recommendations: Recommendations;
};

// Type Definitions
type TimeSegment = 'morning' | 'afternoon' | 'evening' | 'night';
type DayType = 'weekday' | 'weekend';
function extractJsonFromResponse(text: string): PredictionResponse | null {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}') + 1;
  
  if (jsonStart === -1 || jsonEnd === -1) return null;

  try {
    return JSON.parse(text.slice(jsonStart, jsonEnd)) as PredictionResponse;
  } catch (e) {
    return null;
  }
}


export const GetPrediction = async (req: Request, res: Response): Promise<any> => {
  try {
    // 1. Fetch transactions
    const data: Transaction[] = await Transactions_Collection.find();
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    // 2. Categorize and analyze transactions
    const upiCategories: Record<string, RegExp> = {
      food: /(?:zomato|swiggy|restaurant|cafe|food|eat|dining)/i,
      shopping: /(?:amazon|flipkart|myntra|shop|store)/i,
      bills: /(?:electricity|water|bill|payment|recharge)/i,
      transport: /(?:uber|ola|rapido|fuel|petrol)/i,
      entertainment: /(?:movie|netflix|prime|game|concert)/i
    };

    const enrichedData = data.map(tx => {
      const description = tx.Paid_To_Who.name;
      const amount = parseInt(tx.Paid_To_Who.Amount);
      const time = tx.Paid_To_Who.time;
      const [hours, period] = time.split(/:| /);
      const hour = parseInt(hours) + (period === 'PM' && hours !== '12' ? 12 : 0);
      const month = tx.month || 'undefined';

      let category = 'other';
      for (const [cat, regex] of Object.entries(upiCategories)) {
        if (regex.test(description)) {
          category = cat;
          break;
        }
      }

      return {
        ...tx,
        month,
        upiAnalysis: {
          category,
          amount,
          isLarge: amount > 2000,
          timeOfDay: hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 22 ? 'evening' : 'night',
          isWeekend: tx.Paid_To_Who.Weekend
        }
      };
    });

    // 3. Calculate metrics
    const metrics: UPIMetrics = {
      byCategory: {},
      byTime: { morning: 0, afternoon: 0, evening: 0, night: 0 },
      byDay: { weekday: 0, weekend: 0, avgWeekday: 0, avgWeekendDay: 0 },
      largeTransactions: 0,
      monthlyTrends: {}
    };

    // Process transactions
    enrichedData.forEach(tx => {
      const { category, amount, timeOfDay, isWeekend, isLarge } = tx.upiAnalysis;
      const month = tx.month;

      // Initialize category if not exists
      if (!metrics.byCategory[category]) {
        metrics.byCategory[category] = { count: 0, total: 0, avgPerTransaction: 0 };
      }

      // Update metrics
      metrics.byCategory[category].count++;
      metrics.byCategory[category].total += amount;
      metrics.byTime[timeOfDay as keyof TimeMetrics] += amount;
      metrics.byDay[isWeekend ? 'weekend' : 'weekday'] += amount;
      if (isLarge) metrics.largeTransactions++;

      if (!metrics.monthlyTrends[month]) {
        metrics.monthlyTrends[month] = { total: 0, count: 0, avgPerDay: 0 };
      }
      metrics.monthlyTrends[month].total += amount;
      metrics.monthlyTrends[month].count++;
    });

    // Calculate averages
    Object.keys(metrics.byCategory).forEach(cat => {
      metrics.byCategory[cat].avgPerTransaction = metrics.byCategory[cat].total / metrics.byCategory[cat].count;
    });

    metrics.byDay.avgWeekday = metrics.byDay.weekday / 5;
    metrics.byDay.avgWeekendDay = metrics.byDay.weekend / 2;

    Object.keys(metrics.monthlyTrends).forEach(month => {
      const daysInMonth = new Date(2023, ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(month) + 1, 0).getDate();
      metrics.monthlyTrends[month].avgPerDay = metrics.monthlyTrends[month].total / daysInMonth;
    });

    // 4. Generate prediction prompt
    const prompt = `
    **UPI Spending Prediction Request**
    
    **Historical Data:**
    - Months Available: ${Object.keys(metrics.monthlyTrends).join(', ')}
    - Total Transactions: ${data.length}
    
    **Monthly Spending:**
    ${Object.entries(metrics.monthlyTrends).map(([month, data]) => 
      `- ${month}: ₹${data.total} (${data.count} transactions, ₹${data.avgPerDay.toFixed(2)}/day)`
    ).join('\n')}
    
    **Weekly Patterns:**
    - Weekdays: ₹${metrics.byDay.weekday} total (₹${metrics.byDay.avgWeekday.toFixed(2)}/day)
    - Weekends: ₹${metrics.byDay.weekend} total (₹${metrics.byDay.avgWeekendDay.toFixed(2)}/day)
    
    **Category Breakdown:**
    ${Object.entries(metrics.byCategory).map(([cat, data]) => 
      `- ${cat}: ₹${data.total} (${data.count} txns, ₹${data.avgPerTransaction.toFixed(2)} avg)`
    ).join('\n')}
    
    **Time Patterns:**
    - Morning: ₹${metrics.byTime.morning}
    - Afternoon: ₹${metrics.byTime.afternoon}
    - Evening: ₹${metrics.byTime.evening}
    - Night: ₹${metrics.byTime.night}
    
    **Prediction Guidelines:**
    1. Calculate next month's total spending range considering:
       - Recent monthly trends
       - Current spending patterns
       - Category distributions
    2. Predict next weekend's likely spending range based on:
       - Historical weekend averages
       - Recent weekend trends
    3. Identify key insights and recommendations
    
    **Response Format (JSON):**
    {
      "predictions": {
        "monthly": {
          "estimatedTotal": {"min": number, "max": number},
          "primaryCategories": [
            {"category": string, "expectedAmount": number, "percentage": number}
          ],
          "confidence": "low|medium|high"
        },
        "weekly": {
          "weekendEstimate": {"min": number, "max": number},
          "weekdayEstimate": {"min": number, "max": number},
          "confidence": "low|medium|high"
        }
      },
      "insights": {
        "topPatterns": string[],
        "riskFactors": string[]
      },
      "recommendations": {
        "immediate": string[],
        "longTerm": string[]
      }
    }`;

    // 5. Get prediction from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    
    // 6. Parse and enhance the response
    let prediction: PredictionResponse | { rawResponse: string } = { rawResponse: responseText };
    const parsedResponse = extractJsonFromResponse(responseText);

    if (parsedResponse) {
      // Add fallback calculations if any prediction is missing
      if (!parsedResponse.predictions?.monthly) {
        const lastMonth = Object.values(metrics.monthlyTrends)[0];
        const monthlyAvg = Object.values(metrics.monthlyTrends).reduce((sum, month) => sum + month.total, 0) / Object.keys(metrics.monthlyTrends).length;
        
        parsedResponse.predictions = {
          ...parsedResponse.predictions,
          monthly: {
            estimatedTotal: {
              min: Math.round(monthlyAvg * 0.8),
              max: Math.round(monthlyAvg * 1.2)
            },
            primaryCategories: Object.entries(metrics.byCategory)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 3)
              .map(([cat, data]) => ({
                category: cat,
                expectedAmount: Math.round(data.total / Object.keys(metrics.monthlyTrends).length),
                percentage: Math.round((data.total / lastMonth.total) * 100)
              })),
            confidence: "medium"
          }
        };
      }

      if (!parsedResponse.predictions?.weekly) {
        parsedResponse.predictions = {
          ...parsedResponse.predictions,
          weekly: {
            weekendEstimate: {
              min: Math.round(metrics.byDay.avgWeekendDay * 0.7),
              max: Math.round(metrics.byDay.avgWeekendDay * 1.3)
            },
            weekdayEstimate: {
              min: Math.round(metrics.byDay.avgWeekday * 0.7),
              max: Math.round(metrics.byDay.avgWeekday * 1.3)
            },
            confidence: "medium"
          }
        };
      }

      prediction = parsedResponse;
    }

    // 7. Return results
    return res.status(200).json({
      success: true,
      metrics,
      prediction
    });

  } catch (err) {
    console.error("UPI Prediction error:", err);
    return res.status(500).json({
      success: false,
      error: "Prediction failed",
      details: err instanceof Error ? err.message : String(err)
    });
  }
};