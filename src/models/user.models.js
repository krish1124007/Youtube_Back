import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        uniqe:true,
        trim:true,
        index:true,

    },
    fullname:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Watchhistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video",
        }
    ],
    avatar:{
        type:String,
        required:true,
    },
    coverimage:{
        type:String,

    },
    refreshtocken:{
        type:String
    }
},{timestamps:true})

UserSchema.pre("save" , async function(next)
{
    if(!this.isModified("password")){return true}
    this.password =  await bcrypt.hash(this.password ,10);
    next()
})

UserSchema.methods.CompairPass =  async function(password)
{
    return bcrypt.compare(password , this.password)
}
UserSchema.methods.AccessTokenGenerate = function()
{
   return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOCKEN_SECRET
        ,
        {
            expiresIn:process.env.ACCESS_TOCKEN_EXPIRY
        }
    )
}

UserSchema.methods.refreshtockenGenerate = function()
{
   return jwt.sign(
        {
            _id:this._id,

        },
        process.env.REFRESH_TOCKEN_SECRET
        ,
        {
            expiresIn:process.env.REFRESH_TOCKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , UserSchema);