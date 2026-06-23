require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
    const conn = mongoose.createConnection(process.env.PRIMARY_DB_URI);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        const user = await conn.collection('users').findOne();
        console.log("Sample User:", user);
        
        const payment = await conn.collection('payments').findOne();
        console.log("Sample Payment:", payment);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
check();
