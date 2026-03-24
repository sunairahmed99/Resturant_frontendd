import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings } from '../../redux/slices/settingsSlice';

const Settings = () => {
    const dispatch = useDispatch();
    const { data: settingsData, loading, saved } = useSelector(state => state.settings);
    const [notifs, setNotifs] = useState({ newOrder: true, lowStock: true, dailyReport: false, smsAlerts: true });
    const [info, setInfo] = useState({ name: '', tagline: '', phone: '', email: '', address: '', currency: 'PKR', taxRate: '5', timingBanner: '', openingTime: '', closingTime: '', deliveryFee: '300' });

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settingsData) {
            if (settingsData.restaurantInfo) setInfo(settingsData.restaurantInfo);
            if (settingsData.notifications) setNotifs(settingsData.notifications);
        }
    }, [settingsData]);

    const handleSave = async () => {
        dispatch(updateSettings({ restaurantInfo: info, notifications: notifs }));
    };

    if (loading && !settingsData) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-gold)' }}>Loading settings...</div>;
    }

    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">Settings</div>
                    <div className="section-subtitle">Configure your restaurant admin panel</div>
                </div>
                <button className="btn-admin btn-primary-admin" onClick={handleSave} disabled={loading}>
                    {saved ? '✅ Saved!' : '💾 Save Changes'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
                {/* Restaurant Info */}
                <div className="admin-card">
                    <div className="settings-section-title">🍴 Restaurant Info</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label className="form-label-admin">Restaurant Name</label>
                            <input className="admin-input" value={info.name} onChange={e => setInfo(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div>
                            <label className="form-label-admin">Tagline</label>
                            <input className="admin-input" value={info.tagline} onChange={e => setInfo(f => ({ ...f, tagline: e.target.value }))} />
                        </div>
                        <div className="form-row">
                            <div>
                                <label className="form-label-admin">Phone</label>
                                <input className="admin-input" value={info.phone} onChange={e => setInfo(f => ({ ...f, phone: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label-admin">Email</label>
                                <input className="admin-input" value={info.email} onChange={e => setInfo(f => ({ ...f, email: e.target.value }))} />
                            </div>
                        </div>
                        <div>
                            <label className="form-label-admin">Address</label>
                            <input className="admin-input" value={info.address} onChange={e => setInfo(f => ({ ...f, address: e.target.value }))} />
                        </div>
                        <div className="form-row">
                            <div>
                                <label className="form-label-admin">Currency</label>
                                <select className="admin-select" style={{ width: '100%' }} value={info.currency} onChange={e => setInfo(f => ({ ...f, currency: e.target.value }))}>
                                    <option>PKR</option>
                                    <option>USD</option>
                                    <option>EUR</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label-admin">Tax Rate (%)</label>
                                <input className="admin-input" type="number" value={info.taxRate} onChange={e => setInfo(f => ({ ...f, taxRate: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label-admin">Delivery Fee (Rs.)</label>
                                <input className="admin-input" type="number" value={info.deliveryFee} onChange={e => setInfo(f => ({ ...f, deliveryFee: e.target.value }))} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div>
                                <label className="form-label-admin">Opening Time</label>
                                <input className="admin-input" value={info.openingTime || ''} onChange={e => setInfo(f => ({ ...f, openingTime: e.target.value }))} placeholder="e.g. 4:00 PM" />
                            </div>
                            <div>
                                <label className="form-label-admin">Closing Time</label>
                                <input className="admin-input" value={info.closingTime || ''} onChange={e => setInfo(f => ({ ...f, closingTime: e.target.value }))} placeholder="e.g. 1:00 AM" />
                            </div>
                        </div>
                        <div>
                            <label className="form-label-admin">Timing Banner Text</label>
                            <textarea
                                className="admin-input"
                                style={{ minHeight: '80px', resize: 'vertical' }}
                                value={info.timingBanner || ''}
                                onChange={e => setInfo(f => ({ ...f, timingBanner: e.target.value }))}
                                placeholder="Enter the text to display at the top of the website"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="admin-card">
                        <div className="settings-section-title">🔔 Notification Preferences</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { key: 'newOrder', label: 'New Order Alerts', desc: 'Get notified for every new order' },
                                { key: 'lowStock', label: 'Low Stock Warnings', desc: 'Alert when menu items are unavailable' },
                                { key: 'dailyReport', label: 'Daily Reports', desc: 'Receive end-of-day summary report' },
                                { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Critical alerts via SMS' },
                            ].map(n => (
                                <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>{n.label}</div>
                                        <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>{n.desc}</div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" className="toggle-input" checked={notifs[n.key]} onChange={() => setNotifs(f => ({ ...f, [n.key]: !f[n.key] }))} />
                                        <div className="toggle-track" />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin Account */}
                    <div className="admin-card">
                        <div className="settings-section-title">🔐 Admin Account</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label className="form-label-admin">Full Name</label>
                                <input className="admin-input" defaultValue="Admin User" />
                            </div>
                            <div>
                                <label className="form-label-admin">Email Address</label>
                                <input className="admin-input" type="email" defaultValue="admin@restaurant.com" />
                            </div>
                            <div>
                                <label className="form-label-admin">New Password</label>
                                <input className="admin-input" type="password" placeholder="Leave blank to keep current" />
                            </div>
                            <button className="btn-admin btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>🔄 Update Password</button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="admin-card" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
                        <div className="settings-section-title" style={{ color: 'var(--admin-danger)' }}>⚠️ Danger Zone</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>Clear All Orders</div>
                                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Permanently remove all order history</div>
                                </div>
                                <button className="btn-admin btn-sm" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>Clear Orders</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>Reset Panel</div>
                                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Reset all settings to factory defaults</div>
                                </div>
                                <button className="btn-admin btn-sm" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
