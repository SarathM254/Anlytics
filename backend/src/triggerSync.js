require('dotenv').config();
const { runSync } = require('./services/syncService');
require('./config/db');
const mongoose = require('mongoose');

async function trigger() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        await runSync();
        console.log("Manual Sync Triggered and Completed!");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
trigger();
