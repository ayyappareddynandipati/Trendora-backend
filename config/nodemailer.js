const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'vinod783058@gmail.com',
        pass: 'oxee mfbm nsev oiso'
  },
});

module.exports = { transporter };
