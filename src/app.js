import express from "express";
import cors from "cors";
import cookieParser  from "cookie-parser"
import router from "./routes/user.routes.js";
const app = express();

app.use(cors({
    origin:"*"
}))
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/user" , router);


export default app




