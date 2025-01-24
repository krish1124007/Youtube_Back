import mongoose from "mongoose";
import { User } from "../models/user.models.js";

function CheckDataIsNull (ary)
{
   if( ary.some((feild)=>
    feild?.trim()===""
    ))
    {
        return true;
    }
    return false;
}


async function isUserExist(username , email)
{
    let UserData =
    {
        isExist:"",
        data:""
    }

    if(!(username || email))
    {
        return "Error"
    }
    if(!email)
    {
        const user = await User.findOne({username})
        if(user)
            {
               UserData.isExist = true
               UserData.data = user
               return UserData;
            }
            else{
               return false
            }

    }
    if(!username)
    {

        const user = await User.findOne({email})
        if(user)
            {
               UserData.isExist = true
               UserData.data = user
               return UserData;
            }
            else{
               return false
            }

    }


     if(username && email)
     {
        const user = await User.findOne(
            { $or:[{username} , {email}]}
          )
          if(user)
          {
             UserData.isExist = true
             UserData.data = user
             return UserData;
          }
          else{
             return false
          }
     }
}

function EmailChecker(email)
{
    if(email.includes("@"))
    {
        return true;
    }
    else
    {
        return false;
    }
}


export default {isUserExist , EmailChecker , CheckDataIsNull}