const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    razorpay_payment_id: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    teamCode: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets the current timestamp
    }
});

module.exports = mongoose.model("Payment", PaymentSchema);
