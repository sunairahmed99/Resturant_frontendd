import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const navItems = [
  {
    section: 'Main',
    items: [
      { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
      { path: '/admin/banners', label: 'Banners', icon: '🖼️' },
      { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
      { path: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
      { path: '/admin/categories', label: 'Categories', icon: '🗂️' },
      { path: '/admin/menu', label: 'All Items', icon: '🍽️' },
      { path: '/admin/areas', label: 'Areas', icon: '📍' },
      { path: '/admin/branches', label: 'Branches', icon: '🏪' },
      { path: '/admin/customers', label: 'Customers', icon: '👥' },
      { path: '/admin/orders', label: 'Orders', icon: '📋' },
      { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
      { path: '/admin/chat', label: 'Chat Support', icon: '💬' },
    ]
  },
  {
    section: 'System',
    items: [
      { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ]
  }
];

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const isMobile = window.innerWidth <= 768;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onMobileClose}
          style={{ display: 'block', animation: 'fadeIn 0.2s ease' }}
        />
      )}

      <aside
        className={`admin-sidebar ${isMobile
          ? mobileOpen ? 'mobile-visible' : 'mobile-hidden'
          : collapsed ? 'collapsed' : ''
          }`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🍴</div>
          <div className="sidebar-logo-text">
            <h3>ZEST & ZEST</h3>
            <span>Restaurant Panel</span>
          </div>
          {!isMobile && (
            <button className="sidebar-toggle-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
              {collapsed ? '›' : '‹'}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section}>
              <div className="sidebar-section-title">{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={isMobile ? onMobileClose : undefined}
                  title={collapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">A</div>
            <div className="user-details">
              <strong>Admin User</strong>
              <small>Super Admin</small>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
            <span className="logout-icon">🚪</span>
            {!collapsed && <span className="logout-label">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
