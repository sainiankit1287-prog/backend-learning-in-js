import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';

const app=express();

//configration of cors
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))// json data accept kargi
//url data confiration extended provide nested objects 
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// static
app.use(express.static("public"))
app.use(cookieParser())

export {app}