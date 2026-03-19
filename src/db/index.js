
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Function to establish connection with MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using connection string from environment variables
        // DB_NAME is appended to specify which database to use
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        // If connection is successful, log the host name of the database
        console.log(
            `MongoDB connected !! DB host: ${connectionInstance.connection.host}`
        );

    } catch (error) {
        // If any error occurs during connection, log the error
        console.log("MONGODB connection error", error);

        // Exit the process with failure code (1)
        // This stops the server if DB connection fails
        process.exit(1);
    }
};

// Export the function so it can be used in the main server file
export default connectDB;
