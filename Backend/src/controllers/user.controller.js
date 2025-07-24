import httpStatus from "http-status";
import {User} from "../models/user.model.js";
import bcrypt, {hash} from "bcrypt";
// import crypto from "crypto";
import mongoose from "mongoose";
import { Meeting } from "../models/meeting.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const login = async(req, res) => {
    const {username, password} = req.body;
    
    if( !username || !password) {
        return res.status(400).json({message: "Please provide credentials"})
    }

    try{
        const user = await User.findOne({username});
        if(!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found"});
        }
        let isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(isPasswordCorrect){
            const payload = {
                id: user._id,
                username: user.username
            }
            // let token = crypto.randomBytes(20).toString("hex");
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
                }
            )
            
            return res.status(httpStatus.OK).json({token: token})
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Invalid credentials"})
        }

    } catch(error) {
        return res.status(500).json({message: `Something went wrong: ${error}`});
    }
}

const register = async (req, res) => {
    const {name, username, password} = req.body;

    try{
        const existingUser = await User.findOne({username: username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
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
// const getUserHistory = async (req, res) => {
//     const { token } = req.query;

//     try {
//         const user = await User.findOne({ token: token });
//         if(!user){
//             return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invlaid Token "});
//         }
//         const meetings = await Meeting.find({ user_id: user.username })
//         res.json(meetings)
//     } catch (e) {
//         res.json({ message: `Something went wrong ${e}` })
//     }
// }


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
// const addToHistory = async (req, res) => {
//     // const { token, meeting_code } = req.body;

//     try {
//         const user = await User.findOne({ token: token });

//         if(!user) {
//             return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token "});
//         }

//         const newMeeting = new Meeting({
//             user_id: user.username,
//             meeting_code: meeting_code
//         })

//         await newMeeting.save();

//         res.status(httpStatus.CREATED).json({ message: "Added code to history" })
//     } catch (e) {
//         res.json({ message: `Something went wrong ${e}` })
//     }
// }

export {login, register, getUserHistory, addToHistory};