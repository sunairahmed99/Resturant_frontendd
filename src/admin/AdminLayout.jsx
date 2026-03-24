import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import './admin.css';

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setMobileOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const mainClass = `admin-main ${isMobile ? 'sidebar-mobile' : collapsed ? 'sidebar-collapsed' : ''
        }`;

    return (
        <div className="admin-root">
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(c => !c)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <main className={mainClass}>
                <TopBar onMobileMenuToggle={() => setMobileOpen(o => !o)} />
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
