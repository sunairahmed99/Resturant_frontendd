import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../../redux/slices/customerSlice';

const statusCfg = {
    vip: { label: 'VIP', cls: 'badge-gold' },
    active: { label: 'Active', cls: 'badge-success' },
    new: { label: 'New', cls: 'badge-info' },
    inactive: { label: 'Inactive', cls: 'badge-danger' },
};

const CustomersManagement = () => {
    const dispatch = useDispatch();
    const { items: customers, loading } = useSelector(state => state.customers);
    const [search, setSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const getStatus = (count) => {
        if (count >= 10) return 'vip';
        if (count > 1) return 'active';
        return 'new';
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = customers.reduce((a, b) => a + (b.totalSpent || 0), 0);
    const vipCount = customers.filter(c => getStatus(c.totalOrders) === 'vip').length;
    const newCount = customers.filter(c => getStatus(c.totalOrders) === 'new').length;

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-gold)' }}>Loading customers...</div>;
    }

    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">Customers</div>
                    <div className="section-subtitle">{customers.length} registered customers</div>
                </div>
                <div className="page-actions">
                    <div className="input-group-admin" style={{ width: 240 }}>
                        <span className="input-icon">🔍</span>
                        <input className="admin-input" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="btn-admin btn-ghost btn-sm" onClick={() => dispatch(fetchCustomers())}>🔄 Refresh</button>
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                {[
                    { label: 'Total Customers', value: customers.length, icon: '👥', color: '#3b82f6' },
                    { label: 'VIP Customers', value: vipCount, icon: '⭐', color: '#E6B15B' },
                    { label: 'New Customers', value: newCount, icon: '🆕', color: '#10b981' },
                    { label: 'Total Revenue', value: `Rs ${(totalRevenue / 1000).toFixed(1)}k`, icon: '💳', color: '#C02221', noCount: true },
                ].map(s => (
                    <div key={s.label} className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 28 }}>{s.icon}</span>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Total Orders</th>
                                <th>Total Spent</th>
                                <th>Last Order</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => (
                                <tr key={c._id}>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>{String(i + 1).padStart(2, '0')}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                                                {c.name[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{c.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{c.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-muted)' }}>{c.phone}</td>
                                    <td style={{ fontWeight: 600 }}>{c.totalOrders}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--admin-gold)' }}>Rs {(c.totalSpent || 0).toLocaleString()}</td>
                                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                                        {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td><span className={`badge-status ${statusCfg[getStatus(c.totalOrders)].cls}`}>{statusCfg[getStatus(c.totalOrders)].label}</span></td>
                                    <td>
                                        <button className="btn-admin btn-ghost btn-icon btn-sm" onClick={() => setSelectedCustomer(c)} title="View">👁️</button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 60, color: 'var(--admin-text-muted)' }}>No customers found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedCustomer && (
                <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">Customer Profile</div>
                            <button className="modal-close" onClick={() => setSelectedCustomer(null)}>✕</button>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 26, margin: '0 auto 12px', boxShadow: 'var(--shadow-glow-red)' }}>
                                {selectedCustomer.name[0]}
                            </div>
                            <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 18 }}>{selectedCustomer.name}</div>
                            <span className={`badge-status ${statusCfg[getStatus(selectedCustomer.totalOrders)].cls}`} style={{ marginTop: 6, display: 'inline-flex' }}>{statusCfg[getStatus(selectedCustomer.totalOrders)].label}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {[
                                { label: 'Phone', value: selectedCustomer.phone },
                                { label: 'Email', value: selectedCustomer.email },
                                { label: 'Address', value: selectedCustomer.address || 'Not Provided' },
                                { label: 'Total Orders', value: selectedCustomer.totalOrders },
                                { label: 'Total Spent', value: `Rs ${(selectedCustomer.totalSpent || 0).toLocaleString()}` },
                                { label: 'Last Order', value: selectedCustomer.lastOrder ? new Date(selectedCustomer.lastOrder).toLocaleDateString() : 'Never' },
                            ].map(f => (
                                <div key={f.label} style={{ background: 'var(--admin-surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>{f.label}</div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{f.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersManagement;
