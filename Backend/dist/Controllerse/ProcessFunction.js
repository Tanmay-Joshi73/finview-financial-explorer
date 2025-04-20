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
exports.fetchAggregatedData = exports.InsertData = exports.Csv_Convertor = exports.ProcessFile = void 0;
exports.processTransactions = processTransactions;
const fs = require('fs');
const path = require('path');
const trasanctions_1 = __importDefault(require("../Models/trasanctions"));
const PdfParse = require('pdf-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ProcessFile = (location) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(location === null || location === void 0 ? void 0 : location.path))
        throw new Error("No file path provided");
    const filePath = path.resolve(process.cwd(), location.path);
    const buffer = fs.readFileSync(filePath);
    try {
        const data = yield PdfParse(buffer);
        const text = data.text;
        // Regular expression pattern to match transaction details
        const transactionRegex = /(\w{3} \d{1,2}, \d{4})\n(\d{1,2}:\d{2} [AP]M)\n(DEBIT|CREDIT)₹(\d+)(.*?)\nTransaction ID (\w+)\nUTR No\. (\d+)(?:\n.*?)*?\nPaid by\n(.*?)(?=\n\w{3} \d{1,2}, \d{4}|$)/g;
        let transactions = [];
        let match;
        while ((match = transactionRegex.exec(text)) !== null) {
            const date_time = new Date(match[1]);
            const day = date_time.getDay();
            const month = date_time.toLocaleString('default', { month: "short" });
            const Week_End = day === 0 || day === 6;
            transactions.push({
                date: match[1],
                time: match[2],
                MonthName: month,
                type: match[3],
                amount: match[4],
                data: match[5].trim(),
                transaction_Id: match[6],
                UTR: match[7],
                paid_By: match[8],
                Weekend: Week_End,
            });
        }
        return transactions;
    }
    catch (err) {
        console.log(err);
        throw err; // Re-throw the error to be caught by the caller
    }
});
exports.ProcessFile = ProcessFile;
const Csv_Convertor = (transaction, output) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('path is',output)
    const csv_writer = createCsvWriter({
        path: output,
        header: [
            { id: 'date', title: 'DATE' },
            { id: 'time', title: 'TIME' },
            { id: 'monthName', title: 'Month' },
            { id: 'type', title: 'TRANSACTION_TYPE' },
            { id: 'amount', title: 'AMOUNT' },
            { id: 'data', title: 'DESCRIPTION' },
            { id: 'transaction_Id', title: 'TRANSACTION_ID' },
            { id: 'UTR', title: 'UTR_NUMBER' },
            { id: 'paid_By', title: 'PAID_BY' },
            { id: 'Weekend', title: 'Is_Weekend' }
        ]
    });
    yield csv_writer.writeRecords(transaction);
});
exports.Csv_Convertor = Csv_Convertor;
const InsertData = (Data) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedData = Data.map((item) => ({
        month: item.MonthName,
        Date: item.date,
        Paid_To_Who: {
            name: item.data.replace('Paid to ', '').trim(),
            time: item.time,
            Amount: item.amount,
            Weekend: item.Weekend,
        },
        transactionType: item.type
    }));
    yield trasanctions_1.default.insertMany(formattedData);
});
exports.InsertData = InsertData;
function processTransactions(transactions) {
    return transactions.map(t => {
        const [time, period] = t.Paid_To_Who.time.split(' ');
        const [hoursStr, minutesStr] = time.split(':');
        const hours = parseInt(hoursStr);
        const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : hours;
        return Object.assign(Object.assign({}, t), { processed: {
                amount: parseFloat(t.Paid_To_Who.Amount),
                hour24,
                timeCategory: getTimeCategory(hour24),
                dayOfWeek: new Date(t.Date).getDay(),
                date: new Date(t.Date)
            } });
    });
}
function getTimeCategory(hour24) {
    if (hour24 < 6)
        return 'LateNight';
    if (hour24 < 12)
        return 'Morning';
    if (hour24 < 17)
        return 'Afternoon';
    if (hour24 < 21)
        return 'Evening';
    return 'Night';
}
const fetchAggregatedData = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield trasanctions_1.default.find({});
    const dailyMap = {};
    for (const tx of transactions) {
        const dateStr = tx.Date.toISOString().split('T')[0];
        const amount = parseFloat(tx.Paid_To_Who.Amount);
        if (!dailyMap[dateStr]) {
            dailyMap[dateStr] = {
                total: 0,
                weekend: tx.Paid_To_Who.Weekend,
            };
        }
        dailyMap[dateStr].total += amount;
    }
    // Sort by date
    return Object.entries(dailyMap)
        .map(([date, data]) => ({
        date,
        total: data.total.toFixed(2),
        weekend: data.weekend ? 'Yes' : 'No',
    }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});
exports.fetchAggregatedData = fetchAggregatedData;
