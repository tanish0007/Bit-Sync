import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToSocket } from './controllers/socketManager.js';
import userRoutes from './routes/users.routes.js';
import authRoutes from "./routes/auth.routes.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("PORT", (process.env.PORT || 8080));
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

const start = async () => {
    try{
        // app.set("mongo_user");
        const connectionDB = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected with DB host: ${connectionDB.connection.host}`);
    }
    catch(error){
        console.log("Error: ",error)
    }   

    server.listen(app.get("PORT"), () => {
        console.log(`Listening on port: ${app.get("PORT")}`);
    })
}

start()