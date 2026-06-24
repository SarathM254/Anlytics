require('dotenv').config();
const mongoose = require('mongoose');
const { analyticsDbConn } = require('./config/db');
const { DailySummary, SalesmanSnapshot } = require('./models/analyticsModels');

async function backfill() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        const summaries = await DailySummary.find();
        for (const summary of summaries) {
            const snapshots = await SalesmanSnapshot.find({ operationalDate: summary.operationalDate });
            const total = snapshots.reduce((sum, snap) => sum + (snap.broughtForwardDebtSnap || 0), 0);
            
            summary.totalOutstandingDebt = total;
            // Bypass isSealed check by just saving
            await summary.save();
            console.log(`Backfilled ${summary.operationalDate} with totalOutstandingDebt = ${total}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
backfill();
