import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BillVsCashChart({ data }) {
    return (
        <div className="w-full h-80 bg-neutral-900/60 backdrop-blur-md border border-indigo-500/20 rounded-xl p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Daily Value Submissions</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                        <Legend />
                        <Bar dataKey="billValue" name="Total Bill Value" fill="#6366f1" isAnimationActive={true} animationDuration={1000} />
                        <Bar dataKey="cashCollected" name="Total Cash Collected" fill="#10b981" isAnimationActive={true} animationDuration={1000} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
