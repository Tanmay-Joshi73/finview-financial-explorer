import express, { Request, Response } from "express";
import ProcessRoutes from "./Routes/Process.js"
import dotenv from "dotenv"
import Connect from "./Config/config.js";
import morgan from "morgan"
dotenv.config()
const app=express()
app.use(morgan('dev'))
const Start=()=>{
    Connect()
    app.listen(8000,'127.0.0.1',()=>{
        console.log("Hello World")
    })
}
app.use('/API',ProcessRoutes)
Start()
