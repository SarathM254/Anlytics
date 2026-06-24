require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { runSync } = require('./services/syncService');
const analyticsRoutes = require('./routes/analyticsRoutes');
require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);

// Schedule ETL job every 2 minutes (only if not running on Vercel)
if (!process.env.VERCEL) {
    cron.schedule('*/2 * * * *', () => {
        console.log('Running scheduled ETL sync...');
        runSync();
    });
}

const PORT = process.env.PORT || 5001;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
