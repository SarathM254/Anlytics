import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { getSummaries, getSalesmenSnapshots, triggerSync } from '../services/api';
import DebtTrajectoryChart from './charts/DebtTrajectoryChart';
import BillVsCashChart from './charts/BillVsCashChart';
import BFSplitChart from './charts/BFSplitChart';

export default function Dashboard() {
    const [summaries, setSummaries] = useState([]);
    const [salesmenSnapshots, setSalesmenSnapshots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSyncing, setIsSyncing] = useState(false);

    const loadData = async () => {
        try {
            const sumData = await getSummaries();
            setSummaries(sumData);
            
            const salesmenData = await getSalesmenSnapshots(selectedDate);
            setSalesmenSnapshots(salesmenData);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await triggerSync();
            await loadData();
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    // Transform and filter data for charts based on selectedDate
    const validSummaries = [...summaries]
        .sort((a, b) => new Date(a.operationalDate) - new Date(b.operationalDate))
        .filter(s => s.operationalDate <= selectedDate);

    // Debt Trajectory (Last 10 Days)
    const debtSummaries = validSummaries.slice(-10);
    const debtTrajectoryData = debtSummaries.map((s) => ({
        name: s.operationalDate,
        value: (s.totalBillValue || 0) - (s.totalCashCollected || 0) 
    }));

    // Daily Value Submissions (Last 6 Days)
    const billVsCashSummaries = validSummaries.slice(-6);
    const billVsCashData = billVsCashSummaries.map(s => ({
        date: s.operationalDate,
        billValue: s.totalBillValue || 0,
        cashCollected: s.totalCashCollected || 0
    }));

    const bfSplitData = salesmenSnapshots.map(s => ({
        name: s.salesmanName || 'Unknown',
        value: s.broughtForwardDebtSnap || 0
    })).filter(d => d.value > 0);

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-10">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Diligent Analytics</h1>
                    <p className="text-neutral-400">Real-time operational metrics and debt tracking</p>
                </div>
                
                <div className="flex gap-4 mt-4 md:mt-0 items-center">
                    <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
                        <CalendarIcon size={18} className="text-indigo-400 mr-2" />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm text-neutral-300 focus:outline-none"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                    
                    <button 
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Trigger Live Sync'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2 flex flex-col">
                    <span className="text-xs text-neutral-400 italic mb-1">Showing last 10 days up to {selectedDate}</span>
                    <DebtTrajectoryChart data={debtTrajectoryData} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 italic mb-1">Showing last 6 days up to {selectedDate}</span>
                    <BillVsCashChart data={billVsCashData} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 italic mb-1">Showing data exactly for {selectedDate}</span>
                    <BFSplitChart data={bfSplitData} />
                </div>
            </div>
        </div>
    );
}
