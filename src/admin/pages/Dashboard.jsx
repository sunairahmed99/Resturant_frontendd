import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const statusMap = {
    'Pending': { label: 'Pending', cls: 'badge-info' },
    'Confirmed': { label: 'Confirmed', cls: 'badge-primary' },
    'Preparing': { label: 'Preparing', cls: 'badge-warning' },
    'Out for Delivery': { label: 'Out for Delivery', cls: 'badge-secondary' },
    'Delivered': { label: 'Delivered', cls: 'badge-success' },
    'Cancelled': { label: 'Cancelled', cls: 'badge-danger' },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
                {payload.map(p => (
                    <p key={p.name} style={{ color: p.color, fontSize: 13 }}>
                        {p.name === 'revenue' ? `Rs ${p.value.toLocaleString()}` : `${p.value} orders`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const useCounter = (target, duration = 1500) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const targetValue = Number(target) || 0;
        const step = targetValue / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= targetValue) { setCount(targetValue); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
};

const StatCard = ({ icon, label, value, prefix = '', suffix = '', trend, trendUp, color, gradFrom, gradTo }) => {
    const count = useCounter(value);
    return (
        <div className="stat-card" style={{ '--card-accent-1': gradFrom }}>
            <div className="stat-icon-wrap" style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`, boxShadow: `0 4px 15px ${gradFrom}` }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
            </div>
            <div className="stat-body">
                <div className="stat-label">{label}</div>
                <div className="stat-value" style={{ color }}>
                    {prefix}{count.toLocaleString()}{suffix}
                </div>
                <div className={`stat-trend trend-${trendUp ? 'up' : 'down'}`}>
                    <span>{trendUp ? '▲' : '▼'}</span>
                    <span>{trend}% vs last week</span>
                </div>
            </div>
            <div className="stat-bg-icon">{icon}</div>
        </div>
    );
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector(state => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    if (loading || !stats) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-gold)' }}>Loading dashboard stats...</div>;
    }

    return (
        <div>
            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard icon="📋" label="Today Orders" value={stats.todayOrders} trend={14} trendUp color="#e8eaf0" gradFrom="rgba(192,34,33,0.3)" gradTo="rgba(192,34,33,0.1)" />
                <StatCard icon="💰" label="Today Revenue" value={stats.todayRevenue} prefix="Rs " trend={22} trendUp color="#E6B15B" gradFrom="rgba(230,177,91,0.3)" gradTo="rgba(230,177,91,0.1)" />
                <StatCard icon="👥" label="Total Customers" value={stats.totalCustomers} trend={8} trendUp color="#10b981" gradFrom="rgba(16,185,129,0.3)" gradTo="rgba(16,185,129,0.1)" />
                <StatCard icon="🍽️" label="Menu Items" value={stats.totalMenuItems} trend={3} trendUp={false} color="#3b82f6" gradFrom="rgba(59,130,246,0.3)" gradTo="rgba(59,130,246,0.1)" />
            </div>

            {/* Charts Row */}
            <div className="charts-grid">
                {/* Revenue Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <div className="chart-title">Revenue Overview</div>
                            <div className="chart-subtitle">Last 7 days performance</div>
                        </div>
                        <span className="badge-status badge-success" style={{ fontSize: 12 }}>Live Data</span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={stats.revenueData}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#C02221" />
                                    <stop offset="100%" stopColor="#E6B15B" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="day" tick={{ fill: '#7a8499', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#7a8499', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="revenue" stroke="url(#revGrad)" strokeWidth={3} dot={{ fill: '#C02221', strokeWidth: 2, r: 5 }} activeDot={{ r: 7, fill: '#E6B15B' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <div className="chart-title">Order Status</div>
                            <div className="chart-subtitle">Today's breakdown</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={stats.orderStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                {stats.orderStatusData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => [`${v}%`, 'Share']} contentStyle={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 8 }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 8 }}>
                        {stats.orderStatusData.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                                <span style={{ color: 'var(--admin-text-muted)' }}>{d.name}</span>
                                <span style={{ fontWeight: 600 }}>{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-grid">
                {/* Recent Orders */}
                <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="chart-header" style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--admin-border)' }}>
                        <div>
                            <div className="chart-title">Recent Orders</div>
                            <div className="chart-subtitle">Live updates</div>
                        </div>
                        <a href="/admin/orders" style={{ color: 'var(--admin-primary)', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>View All →</a>
                    </div>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td><span style={{ fontWeight: 600, color: 'var(--admin-gold)' }}>{order.orderNumber}</span></td>
                                        <td>{order.customer?.name || 'Unknown'}</td>
                                        <td style={{ fontWeight: 600 }}>Rs {order.grandTotal.toLocaleString()}</td>
                                        <td><span className={`badge-status ${statusMap[order.status]?.cls || 'badge-info'}`}>{order.status}</span></td>
                                        <td style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling */}
                <div className="admin-card">
                    <div className="chart-header" style={{ marginBottom: 16 }}>
                        <div>
                            <div className="chart-title">Top Selling Items</div>
                            <div className="chart-subtitle">Last 7 days</div>
                        </div>
                    </div>
                    {stats.topItems.map((item, i) => (
                        <div className="top-item" key={item.name}>
                            <div className={`top-item-rank rank-${i < 3 ? i + 1 : 'other'}`}>{i + 1}</div>
                            <div className="top-item-info">
                                <div className="top-item-name">{item.name}</div>
                                <div className="top-item-meta">{item.orders} qty sold</div>
                            </div>
                            <div className="top-item-bar">
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${item.percent}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {stats.topItems.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-text-muted)' }}>No sales data yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
