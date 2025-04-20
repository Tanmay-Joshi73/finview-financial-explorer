import mongoose from "mongoose";
const Connect=async()=>{
    try{
    await mongoose.connect("mongodb+srv://tanmayjoshi072:rhxWULugASq8WSkg@cluster0.wcwa8f5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
    })
}
catch(err){
    console.log(err)
}
}

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GeminiApiKey!);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      maxOutputTokens: 2000,
      temperature: 0.7
    }
  });
};
export default Connect;