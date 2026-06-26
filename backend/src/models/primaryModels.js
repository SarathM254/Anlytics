const mongoose = require('mongoose');
const { primaryDbConn } = require('../config/db');

// User Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: { type: String, enum: ["owner", "operator", "salesman"] },
    salesmanId: String,
    broughtForwardDebt: Number
});

const User = primaryDbConn.model('User', userSchema);

// Bill Model
const billSchema = new mongoose.Schema({
    salesmanId: mongoose.Schema.Types.ObjectId,
    billingDate: String, // YYYY-MM-DD
    items: [{
        brandId: mongoose.Schema.Types.ObjectId,
        brandName: String,
        quantity: Number,
        rateSnapShot: Number
    }],
    totalBillValue: Number,
    status: String,
    isPushedToNextDay: Boolean
});

const Bill = primaryDbConn.model('Bill', billSchema);

// Payment Model
const paymentSchema = new mongoose.Schema({
    salesmanId: mongoose.Schema.Types.ObjectId,
    paymentDate: String, // YYYY-MM-DD
    cashBreakdown: { type: Map, of: Number },
    totalHandCash: Number,
    changeAmount: Number,
    phonePeAmount: Number,
    totalPayment: Number,
    status: String
});

const Payment = primaryDbConn.model('Payment', paymentSchema);

// UPI Payment Model
const upiPaymentSchema = new mongoose.Schema({
    paymentMode: String,
    status: String
}, { timestamps: true, collection: 'upipayments' });

const UpiPayment = primaryDbConn.model('UpiPayment', upiPaymentSchema);

module.exports = { User, Bill, Payment, UpiPayment };
