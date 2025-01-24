import {AsycnHandler} from "../utils/AnsycHandler.js"
import FormFunction from "../utils/CheckFrom.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {UploadToCloudNary , DeleteFromCloudNary} from "../utils/Clouadnary.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
import CheckFrom from "../utils/CheckFrom.js"
import mongoose from "mongoose"


async function GenerateAccessAndRefreshTocken (user)
{
    const AccesToken = await  user.AccessTokenGenerate()
    const RefressToken = await user.refreshtockenGenerate()
    user.refreshtocken = await  AccesToken;
    await user.save({validateBeforeSave:false});

    return {AccesToken , RefressToken};
}

const UserRegister = AsycnHandler(async(req ,res)=>{
    const {username,email,password,fullname} =  req.body;
    if(FormFunction.CheckDataIsNull([username ,email,password,fullname]))
    {
        throw new ApiError(400 , "Please Enter All The Feild");
    }

    if(!FormFunction.EmailChecker(email))
    {
          throw new ApiError(400 , "Please Add email Correctly")
    }

    if(await FormFunction.isUserExist(username ,email) == "object")
    {
        throw new ApiError(400, "The username and email is already register Please Try other Username")
    }

    console.log("req.files is ",req.files)
    const avatar = req.files?.avatar[0].path
    const coverimage = req.files?.coverimage[0].path
    

    const avatarUrl = await UploadToCloudNary(avatar)
    const coverimageUrl = await UploadToCloudNary(coverimage)
    
    if(!avatarUrl)
    {
        throw new ApiError(400 , "Something Problem in Upload to image on cloudnary")

    }

    const user = await User.create(
        {
            username,
            email,
            password,
            fullname,
            "avatar":avatarUrl.url,
            "coverimage":coverimage.url || ""
        }
    )

    const CreatedUser = await User.findById(user._id).select("-password -refreshtocken")

    if(!CreatedUser)
    {
        throw new ApiError(500,"Something Went Wrong into creating user")
    }

    return res.status(201).json(
        new ApiResponse(200, CreatedUser,"User is Register")
    )
})

const UserLogin  = AsycnHandler(async(req,res)=>{

    const {username , email , password} = req.body;

    const options = 
    {
        httpOnly:true,
        secure:true,

    }
    if(FormFunction.CheckDataIsNull([username , email , password]))
    {
        throw new ApiError(300,"Please Enter All Feild")
    }

    if(!FormFunction.EmailChecker(email))
    {
        throw new ApiError(300,"Please Enter correct email")
    }

    const UserFromCheking = await FormFunction.isUserExist(username ,email)
    if(typeof UserFromCheking == "boolean")
    {
        throw new ApiError(400,"This user is not Register")
    }
    const UserDataFromDataBase = UserFromCheking.data;

    console.log(await UserDataFromDataBase.CompairPass(password))
    if(! await UserDataFromDataBase.CompairPass(password))
    {
        throw new ApiError(400,"Please Enter CorrectPassword")

    }

    const Tokens = await GenerateAccessAndRefreshTocken(UserDataFromDataBase);
    console.log(Tokens)
    return res.status(200)
    .cookie("AccesToken" ,  Tokens.AccesToken , options)
    .cookie("RefressToken" , Tokens.RefressToken , options)
    .json(
        new ApiResponse(200,UserDataFromDataBase,"User Loggin")
    )
   

})

const UserLogout =  AsycnHandler(async(req ,res)=>{
    // user = req.user
    const options = 
    {
        httpOnly:true,
        secure:true,

    }
    const user = await User.findByIdAndUpdate(req.user._id ,
        {
            $set:{
                refreshtocken:undefined
            }
        },
        {
            new:true
        }
    )

    return res.clearCookie("AccesToken" , options)
    .clearCookie("RefressToken" ,options)
    .json(
        new ApiResponse(200,{},"User Is Logout")
    )

})

const RefrestTokenVerfiy = AsycnHandler(async (req ,res)=>
{
    const RrefreshTockenFromCookie = req.cookie?.RefressToken

    if(!RrefreshTockenFromCookie)
    {
    throw new ApiError(400 , "User Is UnAthanticated");
    }

    const DecodedUser = jwt.verify(RrefreshTockenFromCookie , process.env.REFRESH_TOCKEN_SECRET)

    if(!DecodedUser)
    {
        throw new ApiError(400, "Refresh Token is invalid or used")

    }

    const {AccesToken , RefressToken} =  await GenerateAccessAndRefreshTocken(DecodedUser)
    
    return res.status(201)
    .json(
        new ApiResponse(200 , {
            AccesToken,
            RefressToken
        },
    "User Verfiyd"
)
    )

})

const ChangeCurrentPassword = AsycnHandler(async (req ,res)=>{

    
    const {Currentpassword ,NewPassword} = req.body;
    const user = await  User.findById(req.user._id)

    

    if(!user)
    {
        throw new ApiError(400, "User is Not Found");
    }
    const PasswordIsCorrect = await user.CompairPass(Currentpassword);

    if(!PasswordIsCorrect)
    {
        throw new ApiError(400, "Please Enter Correct Cuurent password");

    }

    user.password =await NewPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200)
    .json(
        new ApiResponse(200 ,{},"Password is Changed")
    )

})

const CurrentUser = AsycnHandler(async(req,res)=>{
    const user = req.user;

    return res.status(200)
    .json(200 ,user , "Current User Founded")
})

const UpdateUserDetails = AsycnHandler(async(req ,res)=>{
    const {username ,email} =  req.body;
    if(!(username && email))
    {
        throw new ApiError(401 , "Please Enter Username and Password")
    }
    if(!username && email)
    {
        if(typeof await CheckFrom.isUserExist(email) !== "boolean")
        {
            throw new ApiError(400 ,"This Email is Already Register");
        }
        await User.findByIdAndUpdate(req.user._id ,
            {
                email
            }
         )

         return res.status(200)
         .json(
            new ApiResponse(200 ,{} , "email is Changed")
         )
    }
    if(!email && username)
    {
        if(typeof await CheckFrom.isUserExist(username) !=="boolean")
        {
          throw new ApiError(401 , "This username is Already exist")   
        }

        await User.findByIdAndUpdate(req.user._id ,
            {
                username
            },
            {
                new:true
            }
         )

         return res.status(200)
         .json(
            new ApiResponse(200 ,{} , "Username is Changed")
         )
         
        
    }
    if(email && username)
    {
           
        if(typeof await CheckFrom.isUserExist(username , email) !=="boolean")
        {
            throw new ApiError(400 , "This username and email is already exist")
        }

       await  User.findByIdAndUpdate(req.user._id ,
            {
                username,
                email
            },
            {
                new:true
            }
         )

         return res.status(200)
         .json(
            new ApiResponse(200 ,{} , "Username and email is Changed")
         )

    }
})

const UpdateAvatar =  AsycnHandler(async(req ,res)=>
{
    console.log(req.file)
    const avatarFile = req.file?.path;
    const user = req.user

    if(!avatarFile)
    {
        throw new ApiError(200,"Please Enter Correct File")
    }

    const UserCloudNaryUrl = user.avatar

    const check = await DeleteFromCloudNary(UserCloudNaryUrl)
    console.log(check)

    const NewImageUrl = await UploadToCloudNary(avatarFile);
     
    const UpdatedUser = await User.findByIdAndUpdate(user._id
        ,
        {
            avatar:NewImageUrl.url
        },
        {
            new:true
        }
    )


    return res.status(200)
    .json(
        new ApiResponse(200 , UpdatedUser , "User Avatar is updated")
    )
})

const ChannelDetail = AsycnHandler(async(req,res)=>
{
    const {username} = req.user;

    if(!username)
    {
        throw new ApiError(400 ,"Sometinh error come in while feching username")
    }
   const user = await User.aggregate([
        {
            $match:{
                username:username?.trim()
            }

        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"Channel",
                as:"subscribers"
            }
        }
        ,
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribed"
            }
        },
        {
            $addFields:{
                TotalSubscribers:
                {
                    $size:"$subscribers"
                }
                ,
                TotalSubscribed:{
                    $size:"$subscribed"
                },
                isSubscribe:
                {
                    $cond:{
                        if:{$in:[req.user?._id , "subscription.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:
            {
                username:1,
                TotalSubscribers:1,
                isSubscribe:1

            }
        }
    ])
    return res.status(200)
    .json(
        new ApiResponse(200 ,
            user,
            "Hole Channel Details"
        )
    )
})

const GetWatchHistory = AsycnHandler(async(req ,res)=>{

    const user = await User.aggregate([
        {
            $match:{
                _id:mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"Watchhistory",
                foreignField:"_id",
                as:"WatchedVideo",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"videoOwner",
                            pipeline:[
                                {
                                    $project:
                                    {
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        },
                       
                    },
                    {
                        $addFields:{
                            videoOwner:
                            {
                                $first:"$videoOwner"
                            }
                        }
                    }
                ]
            }
        },
        

    ])

    return res.status(200)
    .json(
         new ApiResponse(200 , user , "User Watch History")
    )

})


export default {
    
    UserLogin ,
     UserRegister ,
     UserLogout ,
      RefrestTokenVerfiy,
     ChangeCurrentPassword,
     CurrentUser,
     UpdateUserDetails,
     UpdateAvatar,
     ChannelDetail,
     GetWatchHistory,
    };