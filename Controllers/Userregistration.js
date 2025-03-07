const express = require('express');
const bcrypt = require('bcryptjs');
const { transporter } = require('../config/nodemailer');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, isVerified: true });
        await user.save();

        const mailOptions = {
            from: "vinod783058@gmail.com",
            to: email,
            subject: "Welcome Mail from Us",
            text: `Welcome ${name} to our platform!`
        };

        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully");

        res.status(201).json({ msg: "User registered successfully.", user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ msg: "Error registering user", error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
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
        user.resetOtpExpiry = Date.now() + 3600000;
        await user.save();

        const mailOptions = {
            from: "vinod783058@gmail.com",
            to: email,
            subject: "Reset Password OTP",
            text: `Your OTP is ${otp}. It expires in 1 hour.`
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully");

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ msg: "Error sending OTP", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        res.json({ msg: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ msg: "Error logging in", error: error.message });
    }
};
