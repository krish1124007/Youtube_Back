import mongoose from "mongoose";


const SubscriptionSchema = new mongoose.Schema({
    subscriber:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ,
    Channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const subscription = mongoose.model("subscription" , SubscriptionSchema)