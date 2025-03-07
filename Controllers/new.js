const express = require('express');
const { transporter } = require('../config/nodemailer');
const User = require('../models/User');
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }
    const data=await User({name,email,password}).save();
    console.log("User registered successfully", data);
    const mailoptions = {
        from: "vinod783058@gmail.com",
        to: email,
        subject: "New user Registration",
        text: `Hello ${name}, You have successfully registered`
    }
    const info = await transporter.sendMail(mailoptions);
    console.log("Mail sent successfully", info);
    res.json({ msg: "User registered successfully", info });
};

exports.resetpassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ msg: "Please enter email" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

    
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        const mailoptions = {
            from: "vinod783058@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `Your OTP for password reset is: ${otp}`
        }

        await transporter.sendMail(mailoptions);
        res.json({ msg: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ msg: "Error sending OTP", error });
    }
};