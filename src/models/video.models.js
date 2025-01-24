import mongoose from "mongoose";
import mongooseAggresatePaginate from "mongoose-aggregate-paginate-v2"

const VideoSchema = new mongoose.Schema({
    video:{
        type:String,
        required:true,

    },
    Discription:{
        type:String,
        required:true
    },
    title:
    {
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    isPublish:{
        type:Boolean,
       
    },
    view:{
        type:Number,
        default:0,

    },
    duration:{
        type:Number,
        required:true,
    }
},{timestamps:true})

VideoSchema.plugin(mongooseAggresatePaginate);
export const Video = mongoose.model("Video" , VideoSchema);
