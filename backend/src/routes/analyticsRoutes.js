const express = require('express');
const router = express.Router();
const { DailySummary, SalesmanSnapshot } = require('../models/analyticsModels');
const { runSync } = require('../services/syncService');

// GET /api/analytics/summary
router.get('/summary', async (req, res) => {
    try {
        const summaries = await DailySummary.find().sort({ operationalDate: 1 });
        res.json(summaries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analytics/salesmen
router.get('/salesmen', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ error: 'Date is required' });
        
        const snapshots = await SalesmanSnapshot.find({ operationalDate: date });
        res.json(snapshots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/analytics/sync
router.post('/sync', async (req, res) => {
    try {
        await runSync();
        res.json({ message: 'Sync completed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
