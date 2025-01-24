import mongoose from "mongoose";
import { DataBaseName } from "../constance.js";

async function DataBaseConnection()
{
    try{
        const Resposnse = await mongoose.connect(`${process.env.DB_Url}/${DataBaseName}`)
        console.log("DataBase Connect Succesfully")
    }
    catch(error)
    {
        console.log("Something Error went to connection to the database");
    }
}

export default DataBaseConnection;