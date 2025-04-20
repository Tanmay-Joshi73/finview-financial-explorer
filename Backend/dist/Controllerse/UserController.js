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
exports.InvestSuggestion = exports.GetPrediction = exports.VendorsData = exports.ProcessData = exports.FetchData = exports.Process = void 0;
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
    res.send(data);
});
exports.Process = Process;
const FetchData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield trasanctions_js_1.default.find();
    console.log(data);
});
exports.FetchData = FetchData;
const ProcessData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        {
            $match: {
                transactionType: "DEBIT" // Only include expenses
            }
        },
        {
            $addFields: {
                amount: { $toDouble: "$Paid_To_Who.Amount" },
                vendor: "$Paid_To_Who.name",
                hour: { $hour: "$Date" },
                isWeekend: "$Paid_To_Who.Weekend",
                clock: "$Paid_To_Who.time",
                monthName: "$month",
                dayOfWeek: {
                    $arrayElemAt: [
                        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        { $subtract: [{ $dayOfWeek: "$Date" }, 1] }
                    ]
                },
                timeBlock: {
                    $switch: {
                        branches: [
                            { case: { $lte: ["$hour", 5] }, then: "Late Night" },
                            { case: { $lte: ["$hour", 11] }, then: "Morning" },
                            { case: { $lte: ["$hour", 16] }, then: "Afternoon" },
                            { case: { $lte: ["$hour", 20] }, then: "Evening" },
                            { case: { $lte: ["$hour", 23] }, then: "Night" }
                        ],
                        default: "Unknown"
                    }
                }
            }
        },
        {
            $facet: {
                TotalSpent: [
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: "$amount" },
                            transactionCount: { $sum: 1 }
                        }
                    }
                ],
                MonthlySpending: [
                    {
                        $group: {
                            _id: "$monthName",
                            total: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $addFields: {
                            sortOrder: {
                                $indexOfArray: [
                                    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                    "$_id"
                                ]
                            }
                        }
                    },
                    { $sort: { sortOrder: 1 } },
                    { $project: { sortOrder: 0 } }
                ],
                TopVendors: [
                    {
                        $group: {
                            _id: "$vendor",
                            total: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { total: -1 } },
                    { $limit: 5 }
                ],
                SpendingByTimeBlock: [
                    {
                        $group: {
                            _id: "$timeBlock",
                            total: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { total: -1 } }
                ],
                WeekendVsWeekday: [
                    {
                        $group: {
                            _id: "$isWeekend",
                            total: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    }
                ],
                SpendingByDayOfWeek: [
                    {
                        $group: {
                            _id: "$dayOfWeek",
                            total: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $addFields: {
                            sortOrder: {
                                $indexOfArray: [
                                    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                    "$_id"
                                ]
                            }
                        }
                    },
                    { $sort: { sortOrder: 1 } },
                    { $project: { sortOrder: 0 } }
                ]
            }
        }
    ];
    const result = yield trasanctions_js_1.default.aggregate(pipeline);
    const response = {
        totalSpent: result[0].TotalSpent[0] || {},
        monthly: result[0].MonthlySpending,
        topVendors: result[0].TopVendors,
        timeBlocks: result[0].SpendingByTimeBlock,
        weekendVsWeekday: result[0].WeekendVsWeekday,
        dayOfWeek: result[0].SpendingByDayOfWeek
    };
    res.status(200).json(response);
});
exports.ProcessData = ProcessData;
const VendorsData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorAnalyticsPipeline = [
        {
            $match: {
                "Paid_To_Who.name": { $exists: true, $ne: null },
                "Paid_To_Who.Amount": { $exists: true, $ne: null },
                transactionType: "DEBIT"
            }
        },
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
                vendor: {
                    $toLower: {
                        $trim: { input: "$Paid_To_Who.name" }
                    }
                },
                date: "$Date",
                month: { $month: "$Date" },
                dayOfWeek: { $dayOfWeek: "$Date" },
                hour: { $hour: "$Date" }
            }
        },
        {
            $facet: {
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
                dailyPatterns: [
                    {
                        $addFields: {
                            dayName: {
                                $arrayElemAt: [
                                    [
                                        "Sunday",
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday"
                                    ],
                                    { $subtract: ["$dayOfWeek", 1] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                vendor: "$vendor",
                                day: "$dayName"
                            },
                            total: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.vendor",
                            dayWise: {
                                $push: {
                                    day: "$_id.day",
                                    total: "$total",
                                    count: "$count"
                                }
                            }
                        }
                    }
                ],
                recentTransactions: [
                    { $sort: { date: -1 } },
                    {
                        $group: {
                            _id: "$vendor",
                            recent: {
                                $push: {
                                    amount: "$amount",
                                    date: "$date"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            recent: { $slice: ["$recent", 5] }
                        }
                    }
                ]
            }
        }
    ];
    const Result = yield trasanctions_js_1.default.aggregate(vendorAnalyticsPipeline);
    const [data] = Result;
    res.status(200).json({
        vendorStats: data.vendorStats,
        monthlyPatterns: data.monthlyPatterns,
        timePatterns: data.timePatterns,
        dailyPatterns: data.dailyPatterns,
        recentTransactions: data.recentTransactions
    });
});
exports.VendorsData = VendorsData;
const GetPrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield trasanctions_js_1.default.find();
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
        }
        const vendorStats = {};
        data.forEach(tx => {
            var _a;
            const vendor = tx.Paid_To_Who.name.toLowerCase().trim();
            const amount = parseInt(tx.Paid_To_Who.Amount);
            const isWeekend = tx.Paid_To_Who.Weekend;
            const month = tx.month;
            const time = tx.Paid_To_Who.time;
            if (!vendorStats[vendor]) {
                vendorStats[vendor] = {
                    totalAmount: 0,
                    count: 0,
                    months: new Set(),
                    weekends: 0,
                    weekdays: 0,
                    times: { morning: 0, afternoon: 0, evening: 0, night: 0 }
                };
            }
            const [hourPart, minPart, period] = (_a = time.match(/(\d+):(\d+)\s?(AM|PM)/i)) !== null && _a !== void 0 ? _a : ["0", "0", "AM"];
            let hour = parseInt(hourPart);
            if ((period === null || period === void 0 ? void 0 : period.toUpperCase()) === "PM" && hour !== 12)
                hour += 12;
            if ((period === null || period === void 0 ? void 0 : period.toUpperCase()) === "AM" && hour === 12)
                hour = 0;
            const timeOfDay = hour >= 5 && hour < 12 ? "morning" :
                hour >= 12 && hour < 17 ? "afternoon" :
                    hour >= 17 && hour < 21 ? "evening" : "night";
            vendorStats[vendor].totalAmount += amount;
            vendorStats[vendor].count++;
            vendorStats[vendor].months.add(month);
            vendorStats[vendor].times[timeOfDay]++;
            if (isWeekend) {
                vendorStats[vendor].weekends++;
            }
            else {
                vendorStats[vendor].weekdays++;
            }
        });
        const topVendors = Object.entries(vendorStats)
            .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
            .slice(0, 6)
            .map(([name, stats]) => (Object.assign(Object.assign({ name, category: categorizeVendor(name) }, stats), { recurrence: stats.months.size > 1 ? 'recurring' : 'occasional', months: Array.from(stats.months), weekendPercentage: (stats.weekends / stats.count) * 100, timeDistribution: stats.times })));
        const metrics = {
            topVendors,
            topVendorsCoverage: calculateTopVendorsCoverage(data, topVendors),
            byCategory: calculateCategoryMetrics(topVendors),
            monthlyTrends: calculateMonthlyTrends(data, topVendors.map(v => v.name))
        };
        const prompt = generatePredictionPrompt(metrics, topVendors);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = yield model.generateContent(prompt);
        const responseText = result.response.text();
        return res.status(200).json({
            success: true,
            metrics: {
                topVendors: topVendors.map(v => ({
                    name: v.name,
                    totalAmount: v.totalAmount,
                    category: v.category,
                    recurrence: v.recurrence,
                    weekendPercentage: v.weekendPercentage.toFixed(1),
                    timeDistribution: v.timeDistribution
                })),
                topVendorsCoverage: metrics.topVendorsCoverage,
                categoryDistribution: metrics.byCategory,
                monthlyTrends: metrics.monthlyTrends
            },
            prediction: extractJsonFromResponse(responseText) || { rawResponse: responseText }
        });
    }
    catch (err) {
        console.error("Prediction error:", err);
        return res.status(500).json({
            success: false,
            error: "Prediction failed",
            details: err instanceof Error ? err.message : String(err)
        });
    }
});
exports.GetPrediction = GetPrediction;
// Helper functions
function categorizeVendor(vendor) {
    const vendorLower = vendor.toLowerCase();
    if (/restaurant|cafe|food|dining|zomato|swiggy/.test(vendorLower))
        return 'food';
    if (/amazon|flipkart|myntra|shop|store|mart/.test(vendorLower))
        return 'shopping';
    if (/electricity|water|bill|payment|recharge/.test(vendorLower))
        return 'bills';
    if (/uber|ola|rapido|taxi|cab|transport/.test(vendorLower))
        return 'transport';
    return 'other';
}
function calculateTopVendorsCoverage(data, topVendors) {
    const topVendorNames = topVendors.map(v => v.name);
    const totalSpending = data.reduce((sum, tx) => sum + parseInt(tx.Paid_To_Who.Amount), 0);
    const topVendorsSpending = data
        .filter(tx => topVendorNames.includes(tx.Paid_To_Who.name.toLowerCase().trim()))
        .reduce((sum, tx) => sum + parseInt(tx.Paid_To_Who.Amount), 0);
    return (topVendorsSpending / totalSpending) * 100;
}
function calculateCategoryMetrics(topVendors) {
    const categoryMap = {};
    const total = topVendors.reduce((sum, vendor) => sum + vendor.totalAmount, 0);
    topVendors.forEach(vendor => {
        if (!categoryMap[vendor.category]) {
            categoryMap[vendor.category] = 0;
        }
        categoryMap[vendor.category] += vendor.totalAmount;
    });
    return Object.fromEntries(Object.entries(categoryMap).map(([category, totalAmount]) => [
        category,
        {
            total: totalAmount,
            percentage: (totalAmount / total) * 100
        }
    ]));
}
function calculateMonthlyTrends(data, topVendorNames) {
    const monthlyData = {};
    data.forEach(tx => {
        const month = tx.month;
        const amount = parseInt(tx.Paid_To_Who.Amount);
        const isTopVendor = topVendorNames.includes(tx.Paid_To_Who.name.toLowerCase().trim());
        if (!monthlyData[month]) {
            monthlyData[month] = { total: 0, topVendorContribution: 0 };
        }
        monthlyData[month].total += amount;
        if (isTopVendor)
            monthlyData[month].topVendorContribution += amount;
    });
    return monthlyData;
}
function generatePredictionPrompt(metrics, topVendors) {
    return `
**Top Vendors Analysis for Spending Prediction**

**🏆 Top ${topVendors.length} Vendors (${metrics.topVendorsCoverage.toFixed(1)}% of total spending):**
${topVendors.map(v => `- ${v.name}: ₹${v.totalAmount} (${v.category}, ${v.recurrence}, ${v.weekendPercentage.toFixed(1)}% weekends)`).join('\n')}

**📊 Category Distribution:**
${Object.entries(metrics.byCategory).map(([cat, data]) => `- ${cat}: ₹${data.total} (${data.percentage.toFixed(1)}%)`).join('\n')}

**📅 Monthly Trends:**
${Object.entries(metrics.monthlyTrends).map(([month, data]) => `- ${month}: ₹${data.total} total (₹${data.topVendorContribution} from top vendors)`).join('\n')}

**🔮 Prediction Focus:**
1. Estimate next month's spending based on top vendors' patterns
2. Predict which categories will dominate based on top vendors
3. Highlight potential savings opportunities from recurring top vendors
4. Provide specific recommendations for each major vendor

**Expected Output Format:**
{
  "prediction": {
    "nextMonthEstimate": {
      "min": number,
      "max": number,
      "confidence": "low|medium|high"
    },
    "keyVendors": [
      {
        "name": string,
        "expectedAmount": number,
        "recurring": boolean,
        "riskLevel": "low|medium|high"
      }
    ],
    "categoryTrends": [
      {
        "category": string,
        "trend": "increase|decrease|stable",
        "reason": string
      }
    ]
  },
  "recommendations": {
    "vendorSpecific": [
      {
        "vendor": string,
        "action": string,
        "potentialSavings": string
      }
    ],
    "general": string[]
  }
}`;
}
function extractJsonFromResponse(response) {
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }
    catch (e) {
        return null;
    }
}
// Investment suggestion function
const InvestSuggestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aggregate total spending data for the user, grouped by month name and year
        const spendingData = yield trasanctions_js_1.default.aggregate([
            {
                $match: {
                    "Paid_To_Who.Amount": { $exists: true, $ne: null }, // Ensure Amount exists
                    "Paid_To_Who.name": { $exists: true, $ne: null } // Ensure Vendor name exists
                }
            },
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
                    month: "$month", // Use the month name directly from the database
                    year: { $year: "$Date" }, // Extract the year from the Date
                    weekend: "$Paid_To_Who.Weekend" // Add weekend flag for analysis
                }
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year" }, // Group by month name and year
                    totalSpent: { $sum: "$amount" }, // Calculate total spending for the month
                    transactionCount: { $sum: 1 }, // Count number of transactions
                    weekendSpend: { $sum: { $cond: [{ $eq: ["$weekend", true] }, "$amount", 0] } }, // Sum of weekend spend
                    weekdaySpend: { $sum: { $cond: [{ $eq: ["$weekend", false] }, "$amount", 0] } } // Sum of weekday spend
                }
            }
        ]);
        // If no data is found, return an error message
        if (!spendingData.length) {
            return res.status(404).json({ message: "No transactions found for analysis." });
        }
        // Generate investment suggestions based on the spending data
        const suggestions = spendingData.map(({ _id, totalSpent, transactionCount, weekendSpend, weekdaySpend }) => {
            const { month, year } = _id;
            // Calculate potential savings (Assuming user saves 10% of their total spending)
            const potentialSavings = totalSpent * 0.10; // 10% of total spending
            const weeklyIncome = totalSpent * 1.25; // Estimated income: 25% more than spending
            let savingsProfile = "";
            let investmentSuggestions = [];
            // Analyze the weekend vs weekday spending and suggest adjustments
            const weekendSpendingPercentage = (weekendSpend / totalSpent) * 100;
            const weekdaySpendingPercentage = (weekdaySpend / totalSpent) * 100;
            // Based on savings, we will categorize and suggest investments
            if (potentialSavings < 1000) {
                savingsProfile = "Low Savings Potential";
                investmentSuggestions = [
                    "Focus on budgeting using tools like Walnut or MoneyView.",
                    "Consider opening a Fixed Deposit or Recurring Deposit (RD).",
                    "Track your daily spending to find areas for improvement."
                ];
            }
            else if (potentialSavings >= 1000 && potentialSavings < 5000) {
                savingsProfile = "Moderate Savings Potential";
                investmentSuggestions = [
                    "Start SIPs (Systematic Investment Plans) in Debt Mutual Funds.",
                    "Look into Gold ETFs for diversification.",
                    "Explore Public Provident Fund (PPF) for tax-saving options."
                ];
            }
            else {
                savingsProfile = "High Savings Potential";
                investmentSuggestions = [
                    "Start SIPs in Equity Mutual Funds for long-term wealth creation.",
                    "Explore National Pension Scheme (NPS) for retirement planning.",
                    "Look into Diversified Equity Funds or Index Funds for growth."
                ];
            }
            // Weekend Spending Analysis
            if (weekendSpendingPercentage > 50) {
                investmentSuggestions.push("Consider cutting back on weekend splurges to improve savings. Start meal prepping or reducing leisure spending.");
            }
            // Return detailed investment suggestions for each month
            return {
                month,
                year,
                totalSpent,
                transactionCount,
                potentialSavings,
                savingsProfile,
                weekendSpend,
                weekdaySpend,
                weekendSpendingPercentage,
                weekdaySpendingPercentage,
                investmentSuggestions
            };
        });
        return res.status(200).json(suggestions);
    }
    catch (error) {
        console.error("Error generating investment suggestion:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.InvestSuggestion = InvestSuggestion;
