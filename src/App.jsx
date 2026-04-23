import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import BallroomBooking from './pages/BallroomBooking'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import MyOrders from './pages/MyOrders'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import OrdersManagement from './admin/pages/OrdersManagement'
import MenuManagement from './admin/pages/MenuManagement'
import MenuCategories from './admin/pages/MenuCategories'
import CustomersManagement from './admin/pages/CustomersManagement'
import BranchManagement from './admin/pages/BranchManagement'
import Analytics from './admin/pages/Analytics'
import Settings from './admin/pages/Settings'
import AreaManagement from './admin/pages/AreaManagement'
import BannerManagement from './admin/pages/BannerManagement'
import ChatInbox from './admin/pages/ChatInbox'
import BookingManagement from './admin/pages/BookingManagement'
import CouponManagement from './admin/pages/CouponManagement'

function App() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      // Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
      }
      // Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
      }
      // Ctrl+U
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ballroom-booking" element={<BallroomBooking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="categories" element={<MenuCategories />} />
            <Route path="customers" element={<CustomersManagement />} />
            <Route path="branches" element={<BranchManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="areas" element={<AreaManagement />} />
            <Route path="banners" element={<BannerManagement />} />
            <Route path="chat" element={<ChatInbox />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="coupons" element={<CouponManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
