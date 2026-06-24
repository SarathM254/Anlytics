const { User, Bill, Payment } = require('../models/primaryModels');
const { DailySummary, SalesmanSnapshot } = require('../models/analyticsModels');

// Mock system date for testing purposes, typically this would come from a system config
const getSystemDate = () => {
    return new Date().toISOString().split('T')[0];
};

const runSync = async () => {
    try {
        console.log('Starting ETL Sync Process...');
        const systemDate = getSystemDate();

        // Get distinct dates from Bills and Payments
        const billDates = await Bill.distinct('billingDate');
        const paymentDates = await Payment.distinct('paymentDate');
        const allDates = [...new Set([...billDates, ...paymentDates])];

        for (const date of allDates) {
            // Check if snapshot is sealed
            let dailySummary = await DailySummary.findOne({ operationalDate: date });
            if (dailySummary && dailySummary.isSealed) {
                console.log(`Date ${date} is sealed. Skipping.`);
                continue;
            }

            // Aggregate metrics for the date
            const bills = await Bill.find({ billingDate: date });
            const payments = await Payment.find({ paymentDate: date });

            let totalBillsSubmitted = bills.length;
            let totalBillValue = bills.reduce((sum, b) => sum + (b.totalBillValue || 0), 0);
            
            let totalCashCollected = 0;
            let totalPhonePeCollected = 0;
            let totalLooseChangeCollected = 0;
            let totalPaymentCollected = 0;

            payments.forEach(p => {
                let cashVal = p.totalHandCash || 0;
                totalCashCollected += cashVal;
                totalPhonePeCollected += (p.phonePeAmount || 0);
                totalLooseChangeCollected += (p.changeAmount || 0);
                totalPaymentCollected += (p.totalPayment || 0);
            });

            let billedStockVolume = 0;
            bills.forEach(b => {
                b.items.forEach(item => {
                    billedStockVolume += (item.quantity || 0);
                });
            });

            // Fetch users earlier to calculate totalOutstandingDebt
            const users = await User.find({ role: "salesman" });
            const totalOutstandingDebt = users.reduce((sum, user) => sum + (user.broughtForwardDebt || 0), 0);

            // Update or create DailySummary
            const isSealed = date < systemDate;

            if (dailySummary) {
                dailySummary.totalBillsSubmitted = totalBillsSubmitted;
                dailySummary.totalBillValue = totalBillValue;
                dailySummary.totalCashCollected = totalCashCollected;
                dailySummary.totalPhonePeCollected = totalPhonePeCollected;
                dailySummary.totalLooseChangeCollected = totalLooseChangeCollected;
                dailySummary.totalPaymentCollected = totalPaymentCollected;
                dailySummary.totalOutstandingDebt = totalOutstandingDebt;
                dailySummary.billedStockVolume = billedStockVolume;
                dailySummary.isSealed = isSealed;
                await dailySummary.save();
            } else {
                await DailySummary.create({
                    operationalDate: date,
                    totalBillsSubmitted,
                    totalBillValue,
                    totalCashCollected,
                    totalPhonePeCollected,
                    totalLooseChangeCollected,
                    totalPaymentCollected,
                    totalOutstandingDebt,
                    billedStockVolume,
                    unbilledStockVolume: 0, // Mock for now
                    isSealed
                });
            }

            // Consolidate Salesman Stats
            for (const user of users) {
                const salesmanBills = bills.filter(b => b.salesmanId && b.salesmanId.toString() === user._id.toString());
                const salesmanPayments = payments.filter(p => p.salesmanId && p.salesmanId.toString() === user._id.toString());

                let submittedBillValue = salesmanBills.reduce((sum, b) => sum + (b.totalBillValue || 0), 0);
                let submittedPaymentValue = salesmanPayments.reduce((sum, p) => sum + (p.totalPayment || 0), 0);

                await SalesmanSnapshot.findOneAndUpdate(
                    { operationalDate: date, salesmanId: user._id },
                    {
                        salesmanName: user.name,
                        salesmanCode: user.salesmanId,
                        broughtForwardDebtSnap: user.broughtForwardDebt || 0,
                        submittedBillValue,
                        submittedPaymentValue,
                        status: {
                            bill: salesmanBills.length > 0 ? (salesmanBills.every(b => b.status === "verified") ? "Verified" : "Unverified") : "Missing",
                            cash: salesmanPayments.length > 0 ? (salesmanPayments.every(p => p.status === "verified") ? "Verified" : "Unverified") : "Missing"
                        }
                    },
                    { upsert: true, new: true }
                );
            }
        }
        console.log('ETL Sync Process Completed.');
    } catch (error) {
        console.error('ETL Sync Error:', error);
    }
};

module.exports = { runSync };
