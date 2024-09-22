// Importing required modules
import express from "express";          // Express framework for building web applications
import cors from "cors";                // CORS middleware to handle Cross-Origin Resource Sharing
import cookieParser from "cookie-parser"; // Middleware to parse cookies in HTTP requests

// Create an Express application instance
const app = express();

// Middleware to enable CORS with specific configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN,    // Allow requests from this specific origin (set in environment variables)
    credentials: true                   // Allow credentials (cookies, authorization headers) to be sent
}));

// Middleware to parse incoming JSON requests with a size limit of 16KB
app.use(express.json({ limit: "16kb" }));

// Middleware to parse URL-encoded data with extended option and a size limit of 16KB
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse cookies attached to the client request object
app.use(cookieParser());


import userRouter from "./routes/user.routes.js"


//routes declaration 
// app.use("/users",userRouter)

app.use("/api/v1/users",userRouter)//standard methods

// Export the Express application instance for use in other parts of the application
export { app };
