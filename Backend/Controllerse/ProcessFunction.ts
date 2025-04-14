const fs = require('fs')
const path = require('path')
import Transactions_Collection from "../Models/trasanctions";
const PdfParse = require('pdf-parse')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
export const ProcessFile = async (location: Express.Multer.File | undefined): Promise<any[]> => {
    if (!location?.path) throw new Error("No file path provided");
  
    const filePath = path.resolve(process.cwd(), location.path);
    const buffer = fs.readFileSync(filePath);
    
    try {
        const data = await PdfParse(buffer);
        const text = data.text;
        
        // Regular expression pattern to match transaction details
        const transactionRegex = /(\w{3} \d{1,2}, \d{4})\n(\d{1,2}:\d{2} [AP]M)\n(DEBIT|CREDIT)₹(\d+)(.*?)\nTransaction ID (\w+)\nUTR No\. (\d+)(?:\n.*?)*?\nPaid by\n(.*?)(?=\n\w{3} \d{1,2}, \d{4}|$)/g;
        
        let transactions = [];
        let match;
        
        while ((match = transactionRegex.exec(text)) !== null) {
            const date_time=new Date(match[1]);
            const day=date_time.getDay();
            const month=date_time.toLocaleString('default',{month:"short"})
            const Week_End=day===0 || day===6;
            transactions.push({
                date: match[1],
                time: match[2],
                MonthName:month,
                type: match[3],
                amount: match[4],
                data: match[5].trim(),
                transaction_Id: match[6],
                UTR: match[7],
                paid_By: match[8],
                Weekend:Week_End,
            });
        }
        
        return transactions;
    } catch (err) {
        console.log(err);
        throw err; // Re-throw the error to be caught by the caller
    }
};

interface transaction{
  date: string;
  time: string;
  monthName:string;
  type: string;
  amount: string;
  data: string;
  transaction_Id: string;
  UTR: string;
  paid_By: string;
  Weekend:boolean
}

export const Csv_Convertor=async(transaction:transaction[],output:string):Promise<void>=>
{
  // console.log('path is',output)
const csv_writer=createCsvWriter({
  path:output,
  header: [
    { id: 'date', title: 'DATE' },
    { id: 'time', title: 'TIME' },
    { id: 'monthName',title:'Month'},
    { id: 'type', title: 'TRANSACTION_TYPE' },
    { id: 'amount', title: 'AMOUNT' },
    { id: 'data', title: 'DESCRIPTION' },
    { id: 'transaction_Id', title: 'TRANSACTION_ID' },
    { id: 'UTR', title: 'UTR_NUMBER' },
    { id: 'paid_By', title: 'PAID_BY' },
    { id:'Weekend',title:'Is_Weekend'}
  ]
})
await csv_writer.writeRecords(transaction)

}

interface RawTransaction {
  date: string;
  time: string;
  MonthName:string;
  type: string;
  amount: string;
  data: string;
  transaction_Id: string;
  UTR: string;
  paid_By: string;
  Weekend: boolean;
}
export const InsertData=async(Data:RawTransaction[]):Promise<void>=>{
  const formattedData = Data.map((item: RawTransaction) => ({
    month:item.MonthName,
    Date: item.date,
    Paid_To_Who: {
      name: item.data.replace('Paid to ', '').trim(),
      time: item.time,
      Amount: item.amount,
      Weekend: item.Weekend
    }
  }));
   await Transactions_Collection.insertMany(formattedData)
   
}
