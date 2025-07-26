import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import { User } from "../models/user.model.js";

let otpStore = {}; // { "<email>": { otp, expiresAt } }

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const sendOTP = async (req, res) => {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }
    const existingMail = await User.findOne({ email });
    if(existingMail){
        return res.status(409).json({ message: "Mail already exists" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore[email] = { otp, expiresAt, user: { name, username, email, password } };

    // Send via nodemailer
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,   // your gmail
            pass: process.env.EMAIL_PASS,   // app password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for signup",
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP email", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

const verifyOTPAndRegister = async (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: "No OTP request found for this email" });

    if (Date.now() > record.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const { name, username, password } = record.user;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, email, password: hashedPassword });

    await newUser.save();

    delete otpStore[email]; // clean up

    res.status(201).json({ message: "User registered successfully" });
};

export { sendOTP, verifyOTPAndRegister };
