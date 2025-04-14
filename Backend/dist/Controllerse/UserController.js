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
exports.ProcessData = exports.FetchData = exports.Process = void 0;
const fs_1 = __importDefault(require("fs"));
const ProcessFunction_js_1 = require("./ProcessFunction.js");
const ProcessFunction_js_2 = require("./ProcessFunction.js");
const trasanctions_js_1 = __importDefault(require("../Models/trasanctions.js"));
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
                PeakHours: [
                    {
                        $group: {
                            _id: "$clock",
                            transactionCount: { $sum: 1 },
                            totalAmount: { $sum: "$amount" }
                        }
                    },
                    { $sort: { "transactionCount": -1 } },
                    { $limit: 3 },
                    {
                        $project: {
                            hourRange: {
                                $concat: [
                                    { $toString: "$_id" },
                                    ":00-",
                                    { $toString: { $add: ["$_id", 1] } },
                                    ":00"
                                ]
                            },
                            transactionCount: 1,
                            totalAmount: 1,
                            _id: 0
                        }
                    }
                ],
            }
        }
    ];
    const result = yield trasanctions_js_1.default.aggregate(pipeline);
    // const totalAmount = result[0].MonthSpending[0];
    console.log(result[0].PeakHours);
});
exports.ProcessData = ProcessData;
