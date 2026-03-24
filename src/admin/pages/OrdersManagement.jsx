import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus, updateOrderBranch } from '../../redux/slices/orderSlice';
import { fetchBranches } from '../../redux/slices/branchSlice';

const statusConfig = {
    all: { label: 'All', cls: 'badge-info' },
    Pending: { label: 'Pending', cls: 'badge-info' },
    Approved: { label: 'Approved', cls: 'badge-success' },
    Rejected: { label: 'Rejected', cls: 'badge-danger' },
    Confirmed: { label: 'Confirmed', cls: 'badge-primary' },
    Preparing: { label: 'Preparing', cls: 'badge-warning' },
    'Out for Delivery': { label: 'Out for Delivery', cls: 'badge-secondary' },
    Delivered: { label: 'Delivered', cls: 'badge-success' },
    Cancelled: { label: 'Cancelled', cls: 'badge-danger' },
};

const OrdersManagement = () => {
    const dispatch = useDispatch();
    const { items: orders, loading } = useSelector(state => state.orders);
    const { items: branches } = useSelector(state => state.branches);
    const [activeFilter, setActiveFilter] = useState('all');
    const [branchFilter, setBranchFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchBranches());
    }, [dispatch]);

    const filtered = orders.filter(o => {
        const matchStatus = activeFilter === 'all' || o.status === activeFilter;
        const matchBranch = branchFilter === 'all' || o.branch === branchFilter;
        const customerName = o.customer?.name || 'Unknown';
        const matchSearch = customerName.toLowerCase().includes(search.toLowerCase()) || o.orderNumber.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchBranch && matchSearch;
    });

    const handleUpdateStatus = (id, newStatus) => {
        dispatch(updateOrderStatus({ id, status: newStatus }));
    };

    const handleUpdateBranch = (id, branch) => {
        dispatch(updateOrderBranch({ id, branch }));
    };

    const getStatusCount = (status) => {
        if (status === 'all') return orders.length;
        return orders.filter(o => o.status === status).length;
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-gold)' }}>Loading orders...</div>;
    }

    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">Orders Management</div>
                    <div className="section-subtitle">{filtered.length} orders found</div>
                </div>
                <div className="page-actions">
                    <div className="input-group-admin" style={{ width: 220 }}>
                        <span className="input-icon">🔍</span>
                        <input className="admin-input" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="input-group-admin" style={{ width: 180 }}>
                        <select
                            className="admin-select"
                            style={{ margin: 0, padding: '8px 12px' }}
                            value={branchFilter}
                            onChange={e => setBranchFilter(e.target.value)}
                        >
                            <option value="all">All Branches</option>
                            <option value="Delivery Order">Delivery Order</option>
                            {branches.map(b => (
                                <option key={b._id} value={b.name}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-admin btn-ghost btn-sm" onClick={() => dispatch(fetchOrders())}>🔄 Refresh</button>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="scrollable-tabs" style={{ marginBottom: 20 }}>
                <div className="admin-tabs" style={{ display: 'inline-flex', minWidth: 'auto', gap: 4 }}>
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                        <button key={key} className={`tab-btn ${activeFilter === key ? 'active' : ''}`} onClick={() => setActiveFilter(key)}>
                            {cfg.label}
                            <span style={{ marginLeft: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>{getStatusCount(key)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Address</th>
                                <th>Assign Branch</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <React.Fragment key={order._id}>
                                    <tr
                                        onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td><span style={{ fontWeight: 700, color: 'var(--admin-gold)' }}>{order.orderNumber}</span></td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{order.customer?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{order.customer?.phone}</div>
                                        </td>
                                        <td style={{ maxWidth: 140, fontSize: 12, color: 'var(--admin-text-muted)' }}>
                                            {order.customer?.address || '—'}
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                            {order.branch && order.branch !== 'Delivery Order' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-primary)', background: 'rgba(212,175,55,0.12)', borderRadius: 6, padding: '3px 8px' }}>
                                                        {order.branch}
                                                    </span>
                                                    <select
                                                        className="admin-select"
                                                        style={{ fontSize: 11, padding: '3px 6px', width: 'auto' }}
                                                        value={order.branch}
                                                        onChange={e => handleUpdateBranch(order._id, e.target.value)}
                                                    >
                                                        <option value="">Unassign</option>
                                                        {branches.map(b => (
                                                            <option key={b._id} value={b.name}>{b.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <select
                                                    className="admin-select"
                                                    style={{ fontSize: 12, padding: '5px 8px', width: 'auto', border: '1px solid rgba(212,175,55,0.4)', color: 'var(--admin-gold)' }}
                                                    defaultValue=""
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        if (val) handleUpdateBranch(order._id, val);
                                                    }}
                                                >
                                                    <option value="">🏪 Assign Branch</option>
                                                    {branches.map(b => (
                                                        <option key={b._id} value={b.name}>{b.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>Rs {order.grandTotal.toLocaleString()}</td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <select
                                                className="admin-select"
                                                style={{
                                                    fontSize: 12,
                                                    padding: '5px 10px',
                                                    width: 'auto',
                                                    fontWeight: 600,
                                                    borderRadius: 8,
                                                    border: '1.5px solid',
                                                    borderColor:
                                                        order.status === 'Delivered' ? '#22c55e' :
                                                            order.status === 'Cancelled' || order.status === 'Rejected' ? '#ef4444' :
                                                                order.status === 'Pending' ? '#f59e0b' :
                                                                    order.status === 'Preparing' ? '#a78bfa' :
                                                                        order.status === 'Confirmed' || order.status === 'Approved' ? '#3b82f6' :
                                                                            '#64748b',
                                                    color:
                                                        order.status === 'Delivered' ? '#22c55e' :
                                                            order.status === 'Cancelled' || order.status === 'Rejected' ? '#ef4444' :
                                                                order.status === 'Pending' ? '#f59e0b' :
                                                                    order.status === 'Preparing' ? '#a78bfa' :
                                                                        order.status === 'Confirmed' || order.status === 'Approved' ? '#3b82f6' :
                                                                            '#64748b',
                                                    background: 'var(--admin-surface-2)'
                                                }}
                                                value={order.status}
                                                onChange={e => handleUpdateStatus(order._id, e.target.value)}
                                            >
                                                {Object.keys(statusConfig).filter(k => k !== 'all').map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>
                                            {new Date(order.createdAt).toLocaleDateString()} <br />
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                    {expandedId === order._id && (
                                        <tr>
                                            <td colSpan={8} style={{ background: 'var(--admin-surface-2)', padding: '16px 24px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                                                    <div>
                                                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Order Details</div>
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} style={{ marginBottom: 4, fontSize: 13 }}>
                                                                <span style={{ color: 'var(--admin-gold)', fontWeight: 600 }}>{item.quantity}x</span> {item.name}
                                                                <span style={{ color: 'var(--admin-text-muted)', fontSize: 11, marginLeft: 8 }}>Rs {item.totalPrice}</span>
                                                                {item.instructions && <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>Note: {item.instructions}</div>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Customer Info</div>
                                                        <div style={{ fontWeight: 600 }}>{order.customer?.name}</div>
                                                        <div style={{ fontSize: 13 }}>{order.customer?.phone}</div>
                                                        <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 4 }}>{order.customer?.address}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Financials</div>
                                                        <div style={{ fontSize: 13 }}>Subtotal: Rs {order.totalAmount}</div>
                                                        <div style={{ fontSize: 13 }}>Delivery: Rs {order.deliveryFee}</div>
                                                        <div style={{ fontWeight: 700, marginTop: 4, color: 'var(--admin-gold)' }}>Grand Total: Rs {order.grandTotal}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 60, color: 'var(--admin-text-muted)' }}>No orders found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersManagement;
