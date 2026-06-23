import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DebtTrajectoryChart({ data }) {
    return (
        <div className="w-full h-80 bg-neutral-900/60 backdrop-blur-md border border-indigo-500/20 rounded-xl p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Debt Trajectory</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#f43f5e" 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            isAnimationActive={true} 
                            animationDuration={1500} 
                            dot={{ r: 4, strokeWidth: 2, fill: '#f43f5e' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
