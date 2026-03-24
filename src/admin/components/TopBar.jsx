import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
    '/admin': 'Dashboard',
    '/admin/orders': 'Orders Management',
    '/admin/menu': 'Menu Management',
    '/admin/customers': 'Customers',
    '/admin/branches': 'Branch Management',
    '/admin/analytics': 'Analytics',
    '/admin/settings': 'Settings',
};

const TopBar = ({ onMobileMenuToggle }) => {
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'Admin Panel';

    return (
        <header className="admin-topbar">
            <div className="topbar-left">
                <button className="hamburger-btn" onClick={onMobileMenuToggle} title="Toggle menu">
                    ☰
                </button>
                <div>
                    <div className="topbar-page-title">{title}</div>
                    <div className="topbar-breadcrumb">
                        <span>Admin</span>
                        <span>›</span>
                        <span>{title}</span>
                    </div>
                </div>
            </div>

            <div className="topbar-right">
                {/* Search (desktop) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--admin-surface-2)', border: '1px solid var(--admin-border)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', maxWidth: 220 }}
                    className="d-none d-md-flex"
                >
                    <span style={{ color: 'var(--admin-text-muted)', fontSize: 14 }}>🔍</span>
                    <input
                        className="admin-input"
                        placeholder="Search..."
                        style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none', fontSize: 13 }}
                    />
                </div>

                {/* Notification */}
                <button className="topbar-btn">
                    🔔
                    <span className="topbar-notif-badge">3</span>
                </button>

                {/* Live indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--admin-success)', fontWeight: 600 }}
                    className="d-none d-sm-flex"
                >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', display: 'inline-block', animation: 'pulse-badge 2s infinite' }} />
                    LIVE
                </div>

                {/* Avatar */}
                <div className="topbar-avatar">A</div>
            </div>
        </header>
    );
};

export default TopBar;
