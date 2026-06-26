const mongoose = require('mongoose');
const { analyticsDbConn } = require('../config/db');

// DailySummary Model
const dailySummarySchema = new mongoose.Schema({
    operationalDate: { type: String, unique: true },
    totalBillsSubmitted: Number,
    totalBillValue: Number,
    totalCashCollected: Number,
    totalPhonePeCollected: Number,
    totalLooseChangeCollected: Number,
    totalPaymentCollected: Number,
    totalOutstandingDebt: Number,
    billedStockVolume: Number,
    unbilledStockVolume: Number,
    totalUpiTransactions: { type: Number, default: 0 },
    isSealed: { type: Boolean, default: false }
});

const DailySummary = analyticsDbConn.model('DailySummary', dailySummarySchema);

// SalesmanSnapshot Model
const salesmanSnapshotSchema = new mongoose.Schema({
    operationalDate: String,
    salesmanId: mongoose.Schema.Types.ObjectId,
    salesmanName: String,
    salesmanCode: String,
    broughtForwardDebtSnap: Number,
    submittedBillValue: Number,
    submittedPaymentValue: Number,
    status: {
        bill: String,
        cash: String
    }
});

salesmanSnapshotSchema.index({ operationalDate: 1, salesmanId: 1 }, { unique: true });

const SalesmanSnapshot = analyticsDbConn.model('SalesmanSnapshot', salesmanSnapshotSchema);

module.exports = { DailySummary, SalesmanSnapshot };
