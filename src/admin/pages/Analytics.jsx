import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../redux/slices/analyticsSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CustomTip = ({ active, payload, label }) => active && payload?.length ? (
    <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.name === 'revenue' ? `Rs ${p.value.toLocaleString()}` : p.value}</p>)}
    </div>
) : null;

const Analytics = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector(state => state.analytics);
    const [period, setPeriod] = useState('week'); // Not used much yet but kept for UI

    useEffect(() => {
        dispatch(fetchAnalytics());
    }, [dispatch]);

    if (loading || !stats) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-gold)' }}>Loading analytics data...</div>;
    }

    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">Analytics</div>
                    <div className="section-subtitle">Performance overview</div>
                </div>
                <div className="admin-tabs">
                    {['week', 'month'].map(p => (
                        <button key={p} className={`tab-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                            {p === 'week' ? 'This Week' : 'This Month'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 22 }}>
                {stats.kpis.map(k => (
                    <div key={k.label} className="admin-card" style={{ padding: '16px 18px' }}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 20, color: k.color, fontFamily: 'Poppins,sans-serif', marginBottom: 4 }}>{k.value}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{k.label}</div>
                        <div style={{ fontSize: 11, color: k.trendUp ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
                            {k.trendUp ? '▲' : '▼'} {k.sub}
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue + Orders Chart */}
            <div className="charts-grid" style={{ marginBottom: 22 }}>
                <div className="chart-card">
                    <div className="chart-header">
                        <div><div className="chart-title">Revenue Trend</div><div className="chart-subtitle">Daily breakdown last 7 days</div></div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={stats.weeklyData}>
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#C02221" stopOpacity={0.1} />
                                    <stop offset="100%" stopColor="#C02221" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="day" tick={{ fill: '#7a8499', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#7a8499', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTip />} />
                            <Line type="monotone" dataKey="revenue" stroke="#C02221" strokeWidth={3} dot={{ fill: '#C02221', r: 4 }} activeDot={{ r: 6, fill: '#E6B15B' }} />
                            <Line type="monotone" dataKey="orders" stroke="#E6B15B" strokeWidth={2} dot={{ fill: '#E6B15B', r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <div><div className="chart-title">Monthly Revenue</div><div className="chart-subtitle">Last 6 months</div></div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={stats.monthlyData}>
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#C02221" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#C02221" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" tick={{ fill: '#7a8499', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#7a8499', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={v => [`Rs ${v.toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8 }} />
                            <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Customers chart */}
            <div className="chart-card">
                <div className="chart-header">
                    <div><div className="chart-title">Customer Visits</div><div className="chart-subtitle">Daily unique customers last 7 days</div></div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="day" tick={{ fill: '#7a8499', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#7a8499', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={v => [v, 'Customers']} contentStyle={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8 }} />
                        <Bar dataKey="customers" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.85} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
