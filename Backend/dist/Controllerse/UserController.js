"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPrediction = exports.VendorsData = exports.ProcessData = exports.FetchData = exports.Process = void 0;
const fs_1 = __importDefault(require("fs"));
const ProcessFunction_js_1 = require("./ProcessFunction.js");
const ProcessFunction_js_2 = require("./ProcessFunction.js");
const trasanctions_js_1 = __importDefault(require("../Models/trasanctions.js"));
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI('AIzaSyDX1fM7wDiYu5BILjzRzho71PWVpngORso');
const Process = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.send("Given file is not uploaded Please upload the given file");
    }
    const filePath = req.file;
    const data = yield (0, ProcessFunction_js_1.ProcessFile)(filePath);
    if (!fs_1.default.existsSync('./exports')) {
        console.log('hey i am inside the given function call');
        fs_1.default.mkdirSync('../exports');
    }
    const CsvPath = './exports/trasanctions.csv';
    (0, ProcessFunction_js_2.Csv_Convertor)(data, CsvPath);
    (0, ProcessFunction_js_2.InsertData)(data);
});
exports.Process = Process;
const FetchData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield trasanctions_js_1.default.find();
    console.log(data);
});
exports.FetchData = FetchData;
const ProcessData = (Req, Res) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        {
            $addFields: {
                amount: { $toDouble: "$Paid_To_Who.Amount" },
                vendor: "$Paid_To_Who.name",
                hour: { $hour: "$Date" },
                monthName: "$month",
                clock: "$Paid_To_Who.time",
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
                Month: [
                    {
                        $group: {
                            _id: "$month",
                            MonthSpending: { $sum: "$amount" },
                            TotalTransaction: { $sum: 1 }
                        }
                    }
                ],
                TopVendor: [
                    {
                        $group: {
                            _id: "$vendor",
                            VendorSpending: { $sum: "$amount" },
                            TransactionCount: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "VendorSpending": -1 } // TypeScript needs this exact syntax
                    },
                    {
                        $limit: 5
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
    const result = yield trasanctions_js_1.default.aggregate(pipeline);
    // const totalAmount = result[0].MonthSpending[0];
    console.log(result[0]);
});
exports.ProcessData = ProcessData;
const VendorsData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorAnalyticsPipeline = [
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
    const Result = yield trasanctions_js_1.default.aggregate(vendorAnalyticsPipeline);
    console.log(JSON.stringify(Result));
});
exports.VendorsData = VendorsData;
function extractJsonFromResponse(text) {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === -1)
        return null;
    try {
        return JSON.parse(text.slice(jsonStart, jsonEnd));
    }
    catch (e) {
        return null;
    }
}
const GetPrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // 1. Fetch transactions
        const data = yield trasanctions_js_1.default.find();
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
        }
        // 2. Categorize and analyze transactions
        const upiCategories = {
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
            return Object.assign(Object.assign({}, tx), { month, upiAnalysis: {
                    category,
                    amount,
                    isLarge: amount > 2000,
                    timeOfDay: hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 22 ? 'evening' : 'night',
                    isWeekend: tx.Paid_To_Who.Weekend
                } });
        });
        // 3. Calculate metrics
        const metrics = {
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
            metrics.byTime[timeOfDay] += amount;
            metrics.byDay[isWeekend ? 'weekend' : 'weekday'] += amount;
            if (isLarge)
                metrics.largeTransactions++;
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
            const daysInMonth = new Date(2023, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month) + 1, 0).getDate();
            metrics.monthlyTrends[month].avgPerDay = metrics.monthlyTrends[month].total / daysInMonth;
        });
        // 4. Generate prediction prompt
        const prompt = `
    **UPI Spending Prediction Request**
    
    **Historical Data:**
    - Months Available: ${Object.keys(metrics.monthlyTrends).join(', ')}
    - Total Transactions: ${data.length}
    
    **Monthly Spending:**
    ${Object.entries(metrics.monthlyTrends).map(([month, data]) => `- ${month}: ₹${data.total} (${data.count} transactions, ₹${data.avgPerDay.toFixed(2)}/day)`).join('\n')}
    
    **Weekly Patterns:**
    - Weekdays: ₹${metrics.byDay.weekday} total (₹${metrics.byDay.avgWeekday.toFixed(2)}/day)
    - Weekends: ₹${metrics.byDay.weekend} total (₹${metrics.byDay.avgWeekendDay.toFixed(2)}/day)
    
    **Category Breakdown:**
    ${Object.entries(metrics.byCategory).map(([cat, data]) => `- ${cat}: ₹${data.total} (${data.count} txns, ₹${data.avgPerTransaction.toFixed(2)} avg)`).join('\n')}
    
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
        const result = yield model.generateContent(prompt);
        const response = result.response;
        const responseText = response.text();
        // 6. Parse and enhance the response
        let prediction = { rawResponse: responseText };
        const parsedResponse = extractJsonFromResponse(responseText);
        if (parsedResponse) {
            // Add fallback calculations if any prediction is missing
            if (!((_a = parsedResponse.predictions) === null || _a === void 0 ? void 0 : _a.monthly)) {
                const lastMonth = Object.values(metrics.monthlyTrends)[0];
                const monthlyAvg = Object.values(metrics.monthlyTrends).reduce((sum, month) => sum + month.total, 0) / Object.keys(metrics.monthlyTrends).length;
                parsedResponse.predictions = Object.assign(Object.assign({}, parsedResponse.predictions), { monthly: {
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
                    } });
            }
            if (!((_b = parsedResponse.predictions) === null || _b === void 0 ? void 0 : _b.weekly)) {
                parsedResponse.predictions = Object.assign(Object.assign({}, parsedResponse.predictions), { weekly: {
                        weekendEstimate: {
                            min: Math.round(metrics.byDay.avgWeekendDay * 0.7),
                            max: Math.round(metrics.byDay.avgWeekendDay * 1.3)
                        },
                        weekdayEstimate: {
                            min: Math.round(metrics.byDay.avgWeekday * 0.7),
                            max: Math.round(metrics.byDay.avgWeekday * 1.3)
                        },
                        confidence: "medium"
                    } });
            }
            prediction = parsedResponse;
        }
        // 7. Return results
        return res.status(200).json({
            success: true,
            metrics,
            prediction
        });
    }
    catch (err) {
        console.error("UPI Prediction error:", err);
        return res.status(500).json({
            success: false,
            error: "Prediction failed",
            details: err instanceof Error ? err.message : String(err)
        });
    }
});
exports.GetPrediction = GetPrediction;
