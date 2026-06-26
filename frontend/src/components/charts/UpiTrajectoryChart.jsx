import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UpiTrajectoryChart({ data }) {
    return (
        <div className="w-full h-80 bg-neutral-900/60 backdrop-blur-md border border-green-500/20 rounded-xl p-4 flex flex-col mt-8 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <h3 className="text-lg font-semibold mb-4 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">UPI Payment Volume</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUpi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#22c55e" 
                            fillOpacity={1} 
                            fill="url(#colorUpi)" 
                            isAnimationActive={true} 
                            animationDuration={1500} 
                            dot={{ r: 4, strokeWidth: 2, fill: '#22c55e', stroke: '#14532d' }}
                            activeDot={{ r: 6, fill: '#86efac', stroke: '#22c55e', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
