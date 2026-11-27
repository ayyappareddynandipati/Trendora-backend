const nodemailer = require("nodemailer");

// Gmail credentials come from .env (EMAIL_USER, EMAIL_PASS). Never hard-code them.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = { transporter };
