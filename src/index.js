import dotenv from "dotenv"
import app from "./app.js"
import DataBaseConnection from "./db/index.js"

dotenv.config({
    path:"../.env"
})


DataBaseConnection()
.then(
    app.listen(process.env.PORT ,()=>{
        console.log(`App Is listing to port ${process.env.PORT}`)
    })
)
.catch((err)=>{
    console.log("Somethin went Wrong into connect to app")
})