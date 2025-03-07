const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const { transporter } = require('../config/nodemailer');
require("dotenv").config(); // Load environment variables

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; 

// ✅ User Signup
exports.signup = async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;

        // Validate input
        if (!fname || !lname || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered. Please login." });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fname, lname, email, password: hashedPassword });

        await newUser.save();

  
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER, // Use environment variable
                to: email,
                subject: "Registration Successful",
                text: `Hello ${fname} ${lname},\n\nYou have successfully registered!\n\nThank you for joining us.`,
            });
            console.log(`Signup email sent to ${email}`);
        } catch (emailError) {
            console.error("Email Sending Error:", emailError);
        }

        res.status(201).json({ message: "Signup successful! Please login." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// ✅ User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

     
        const token = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY, { expiresIn: "1h" });


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        res.json({ message: "Login successful!", user: { email: user.email, fname: user.fname }, token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// ✅ Password Reset
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found! Please sign up." });
        }

        // Hash new password and update
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        // Send password reset confirmation email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Changed Successfully",
                text: `Hello,\n\nYour password has been changed successfully.\n\nIf this wasn't you, please contact support immediately.`,
            });
            console.log(`Password reset email sent to ${email}`);
        } catch (emailError) {
            console.error("Email Sending Error:", emailError);
        }

        res.json({ message: "Your password has been updated! Please log in." });
    } catch (error) {
        console.error("Password Reset Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// ✅ Logout
exports.logout = (req, res) => {
    res.cookie("token", "", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "Strict", 
        expires: new Date(0) // Expire the cookie immediately
    });

    res.status(200).json({ message: "Logged out successfully!" });
};

const otpStore = new Map(); // Temporary storage for OTPs (Use Redis for production)

// ✅ Send OTP to Email (Instead of Direct Signup)
exports.sendOtp = async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;

        if (!fname || !lname || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
     console.log("api call");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered. Please login." });
        }

        const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
        // Generate 6-digit OTP
        otpStore.set(email, { otp, fname, lname, email, password, expiresAt: Date.now() + 300000 }); // Store OTP for 5 minutes

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Hello ${fname},\n\nYour OTP for signup is: ${otp}\n\nIt is valid for 5 minutes.`,
        });

        res.status(200).json({ message: "OTP sent to email. Please verify within 5 minutes." });
    } catch (error) {
        console.error("OTP Sending Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check if OTP exists for the given email
        if (!otpStore.has(email)) {
            return res.status(400).json({ message: "OTP expired or invalid." });
        }

        const storedData = otpStore.get(email);

        // Validate OTP format (must be a 4-digit number)
        if (!/^\d{4}$/.test(otp)) {
            return res.status(400).json({ message: "Invalid OTP format. It should be a 4-digit number." });
        }

        // Verify OTP value
        if (storedData.otp !== parseInt(otp, 10)) {
            return res.status(400).json({ message: "Incorrect OTP." });
        }

        // Check OTP expiration
        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: "OTP expired." });
        }

        res.status(200).json({ message: "OTP verified successfully!" });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
