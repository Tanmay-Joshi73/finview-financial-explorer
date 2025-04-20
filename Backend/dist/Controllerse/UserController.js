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
        // 2. Categorize and enrich transactions
        const upiCategories = {
            food: /(?:zomato|swiggy|restaurant|cafe|food|eat|dining)/i,
            shopping: /(?:amazon|flipkart|myntra|shop|store)/i,
            bills: /(?:electricity|water|bill|payment|recharge)/i,
            transport: /(?:uber|ola|rapido|fuel|petrol)/i,
            entertainment: /(?:movie|netflix|prime|game|concert)/i,
            healthcare: /(?:hospital|clinic|medicine|doctor|pharmacy|health|treatment|care)/i,
            education: /(?:tuition|school|college|university|books|study|learning|education)/i,
            fitness: /(?:gym|workout|fitness|yoga|exercise|trainer|wellness|sports)/i,
            travel: /(?:airline|flight|train|hotel|trip|holiday|tour|car rental|cruise|tourism)/i,
            charity: /(?:donation|charity|fundraiser|ngo|give|help|support|cause)/i,
            legal: /(?:lawyer|legal|court|consultation|case|document|attorney)/i,
            subscription: /(?:subscription|membership|renewal|plan|service|monthly|yearly|auto-renewal)/i,
            realEstate: /(?:rent|property|home|real estate|apartment|house|broker|sale|renting)/i,
            insurance: /(?:insurance|policy|health insurance|life insurance|car insurance|premium|coverage|claims)/i,
            gaming: /(?:gaming|playstation|xbox|steam|games|online gaming|game card|purchase|game credit)/i,
            onlinePayment: /(?:paytm|google pay|phonepe|amazon pay|razorpay|bhim|wallet|payment)/i,
            petCare: /(?:pet|dog|cat|pet care|food|vet|grooming|pet insurance|vet visit)/i,
            banking: /(?:bank|transfer|withdrawal|deposit|ATM|interest|loan|EMI|savings|account)/i,
        };
        const enrichedData = data.map(tx => {
            var _a;
            const description = tx.Paid_To_Who.name;
            const amount = parseInt(tx.Paid_To_Who.Amount);
            const time = tx.Paid_To_Who.time;
            const [hourPart, minPart, period] = (_a = time.match(/(\d+):(\d+)\s?(AM|PM)/i)) !== null && _a !== void 0 ? _a : ["0", "0", "AM"];
            let hour = parseInt(hourPart);
            if ((period === null || period === void 0 ? void 0 : period.toUpperCase()) === "PM" && hour !== 12)
                hour += 12;
            if ((period === null || period === void 0 ? void 0 : period.toUpperCase()) === "AM" && hour === 12)
                hour = 0;
            const timeOfDay = hour >= 5 && hour < 12
                ? "morning"
                : hour >= 12 && hour < 17
                    ? "afternoon"
                    : hour >= 17 && hour < 21
                        ? "evening"
                        : "night";
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
                    timeOfDay,
                    isWeekend: tx.Paid_To_Who.Weekend
                } });
        });
        // 3. Metrics calculation
        const metrics = {
            byCategory: {},
            byTime: { morning: 0, afternoon: 0, evening: 0, night: 0 },
            byDay: { weekday: 0, weekend: 0, avgWeekday: 0, avgWeekendDay: 0 },
            largeTransactions: 0,
            monthlyTrends: {}
        };
        enrichedData.forEach(tx => {
            const { category, amount, timeOfDay, isWeekend, isLarge } = tx.upiAnalysis;
            const month = tx.month;
            if (!metrics.byCategory[category]) {
                metrics.byCategory[category] = { count: 0, total: 0, avgPerTransaction: 0 };
            }
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
        Object.entries(metrics.byCategory).forEach(([cat, data]) => {
            data.avgPerTransaction = data.total / data.count;
        });
        metrics.byDay.avgWeekday = metrics.byDay.weekday / 5;
        metrics.byDay.avgWeekendDay = metrics.byDay.weekend / 2;
        Object.entries(metrics.monthlyTrends).forEach(([month, info]) => {
            const daysInMonth = new Date(2023, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month) + 1, 0).getDate();
            info.avgPerDay = info.total / daysInMonth;
        });
        // 4. Gemini prompt generation
        const prompt = `
**📊 UPI Spending Prediction Request for Smart Insights**

**🗓 Historical Monthly Overview:**
Months Available: ${Object.keys(metrics.monthlyTrends).join(', ')}
Total Transactions: ${data.length}

${Object.entries(metrics.monthlyTrends).map(([month, m]) => `- ${month}: ₹${m.total} across ${m.count} txns (₹${m.avgPerDay.toFixed(2)}/day)`).join('\n')}

**📅 Daywise Trends:**
- Weekdays: ₹${metrics.byDay.weekday} total (Avg: ₹${metrics.byDay.avgWeekday.toFixed(2)}/day)
- Weekends: ₹${metrics.byDay.weekend} total (Avg: ₹${metrics.byDay.avgWeekendDay.toFixed(2)}/day)

**⏰ Time-Based Spending:**
- Morning: ₹${metrics.byTime.morning}
- Afternoon: ₹${metrics.byTime.afternoon}
- Evening: ₹${metrics.byTime.evening}
- Night: ₹${metrics.byTime.night}

**📂 Category Spending:**
${Object.entries(metrics.byCategory).map(([cat, d]) => `- ${cat}: ₹${d.total} in ${d.count} txns (₹${d.avgPerTransaction.toFixed(2)} avg)`).join('\n')}

**🔮 Prediction Goals:**
1. Predict total next month spending (range + confidence)
2. Estimate weekend vs weekday trends
3. Highlight time-based & category risks (esp. night spends)
4. Give suggestions for smart savings and control

**Expected JSON Output:**
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
}
`;
        // 5. Send to Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = yield model.generateContent(prompt);
        const responseText = result.response.text();
        // 6. Parse and enhance Gemini response
        let prediction = { rawResponse: responseText };
        const parsedResponse = extractJsonFromResponse(responseText);
        if (parsedResponse) {
            // Add fallbacks if Gemini misses any part
            if (!((_a = parsedResponse.predictions) === null || _a === void 0 ? void 0 : _a.monthly)) {
                const avg = Object.values(metrics.monthlyTrends).reduce((a, b) => a + b.total, 0) / Object.keys(metrics.monthlyTrends).length;
                const top3 = Object.entries(metrics.byCategory).sort((a, b) => b[1].total - a[1].total).slice(0, 3);
                parsedResponse.predictions = Object.assign(Object.assign({}, parsedResponse.predictions), { monthly: {
                        estimatedTotal: {
                            min: Math.round(avg * 0.8),
                            max: Math.round(avg * 1.2)
                        },
                        primaryCategories: top3.map(([cat, d]) => ({
                            category: cat,
                            expectedAmount: Math.round(d.total / Object.keys(metrics.monthlyTrends).length),
                            percentage: Math.round((d.total / avg) * 100)
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
        // 7. Return result
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
