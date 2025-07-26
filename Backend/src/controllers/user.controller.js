import httpStatus from "http-status";
import {User} from "../models/user.model.js";
import bcrypt, {hash} from "bcrypt";
// import crypto from "crypto";
import mongoose from "mongoose";
import { Meeting } from "../models/meeting.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide credentials" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
        const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
    };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return res.status(httpStatus.OK).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name
            }
        });
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};

const register = async (req, res) => {
    const {name,email, username, password} = req.body;

    try{
        const existingUser = await User.findOne({username: username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message: "User already exists"});
        }
        const existingMail = await User.findOne({ email });
        if(existingMail){
            return res.status(httpStatus.FOUND).json({ message: "Mail already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: hashedPassword
        })

        await newUser.save();
        res.status(httpStatus.CREATED).json({message: "User registered successfully"});

    } catch(error) {
        res.json({message: `There's an error: ${error}`});
    }
}

const getUserHistory = async (req, res) => {
    try {
        const meetings = await Meeting.find({ user_id: req.user.username });
        res.status(200).json(meetings);
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e}` });
    }
};


const addToHistory = async (req, res) => {
    const { meeting_code } = req.body;

    try {
        const newMeeting = new Meeting({
            user_id: req.user.username,
            meeting_code
        });

        await newMeeting.save();
        res.status(httpStatus.CREATED).json({ message: "Added code to history" });
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e}` });
    }
};

const getUserDashboard = async (req, res) => {
    // This req.user is already set in protect middleware
    res.status(200).json({
        success: true,
        user: req.user,
    });
};

export {getUserDashboard, login, register, getUserHistory, addToHistory};