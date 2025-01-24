import { AsycnHandler } from "../utils/AnsycHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

export const GetUserData = AsycnHandler(async(req,_,next)=>
{

    const AccesTocken = req.cookies?.AccesToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!AccesTocken)
    {
        throw new ApiError(400 , "User Is UnAuthoration")
    }

    const DecodedUser = jwt.verify(AccesTocken , process.env.ACCESS_TOCKEN_SECRET)

    if(!DecodedUser)
    {
        throw new ApiError(400 , "AccesToken is not valid")
    }
    const user = await User.findById(DecodedUser._id).select("-password -refreshtocken");

    req.user = user;
    next();


}

)