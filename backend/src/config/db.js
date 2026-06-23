const mongoose = require('mongoose');

// Primary read-only connection
const primaryDbConn = mongoose.createConnection(process.env.PRIMARY_DB_URI);

primaryDbConn.on('connected', () => {
    console.log('Connected to Primary DB');
});

primaryDbConn.on('error', (err) => {
    console.error('Primary DB Connection Error:', err);
});

// Analytics read/write connection
const analyticsDbConn = mongoose.createConnection(process.env.ANALYTICS_DB_URI);

analyticsDbConn.on('connected', () => {
    console.log('Connected to Analytics DB');
});

analyticsDbConn.on('error', (err) => {
    console.error('Analytics DB Connection Error:', err);
});

module.exports = {
    primaryDbConn,
    analyticsDbConn
};
