import  {Request,Response} from "express"
import fs from 'fs'
import { ProcessFile } from "./ProcessFunction.js";
import {Multer} from "multer"
import { Csv_Convertor,InsertData} from "./ProcessFunction.js";
import Transactions_Collection from "../Models/trasanctions.js";
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
           
            PeakHours: [
                {
                  $group: {
                    _id: "$clock",
                    transactionCount: { $sum: 1 },
                    totalAmount: { $sum: "$amount" }
                  }
                },
                { $sort: {"transactionCount": -1 as  const } },
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
    const result=await Transactions_Collection.aggregate(pipeline)
    // const totalAmount = result[0].MonthSpending[0];
    console.log(result[0].PeakHours)
}