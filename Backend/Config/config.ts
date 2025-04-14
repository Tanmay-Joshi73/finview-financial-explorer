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
export default Connect;