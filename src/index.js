//import { configDotenv } from "dotenv";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js"; // ✅ import database before connectDB() functionuse it 
import { app } from "./app.js"
dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {

        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at port:${process.env.PORT}`);
        });

        // ✅ HANDLE SERVER ERRORS HERE
        server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                console.log("Port already in use");
            } else {
                console.log("Server Error:", error);
            }
        });

    })
    .catch((err) => {
        console.log("MONGO DB CONNECTION FAILED !!", err);
    });


/*

import mongoose from "mongoose";
import express from "express";
const app = express();
// use iife function to use for IIFE stands for Immediately Invoked Function Expression.
(async ()=>{
    try {
        // await mongoose.connect(`${process.env.MONGODB_URI}$/{DB_NAME}`);  not do this type of silly mistake
        const ankit=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.log("Error",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
            console.log(ankit)
        })
    } catch (error) {
        console.error("Error", error)
        throw error
        
    }
})()
    */