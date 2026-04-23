import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings } from '../redux/slices/settingsSlice';
import { Link } from 'react-router-dom';

const Navbar = ({ onShowCart }) => {
  const dispatch = useDispatch();
  const { data: settings } = useSelector(state => state.settings);
  const cartItems = useSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (!settings) {
      dispatch(fetchSettings());
    }
  }, [dispatch, settings]);

  const timingString = settings?.restaurantInfo?.timingBanner || 'Welcome to ZEST & ZEST';

  return (
    <div className="navbar-container sticky-top bg-black">
      {/* Top Banner - Timings */}
      <div className="bg-black text-white text-center py-2 px-3 fw-bold border-bottom border-secondary border-opacity-25 timing-banner">
        <span>{timingString}</span>
      </div>

      {/* Main Nav Banner */}
      <nav className="navbar navbar-dark bg-black px-3 px-md-5 py-2">
        <div className="container-fluid p-0 d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand m-0 flex-shrink-0 text-decoration-none">
            <div className="logo-wrapper position-relative">
              <h2 className="m-0 premium-logo fw-bold" style={{ letterSpacing: '2px' }}>ZEST & ZEST</h2>
            </div>
          </Link>

          {/* Center: Booking & Tracking (Desktop) */}
          <div className="d-none d-md-flex align-items-center justify-content-center gap-3 flex-grow-1 font-body">
            <Link
              to="/my-orders"
              className="btn btn-sm px-4 py-2 rounded-pill btn-glass fw-semibold"
              style={{ fontSize: '14px' }}
            >
              Track Orders
            </Link>
            <Link
              to="/ballroom-booking"
              className="btn btn-sm px-4 py-2 rounded-pill btn-premium fw-bold"
              style={{ fontSize: '14px' }}
            >
              Ballroom Booking
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* Ballroom Booking & Tracking (Mobile) */}
            <div className="d-md-none d-flex gap-2">
              <Link
                to="/my-orders"
                className="btn btn-sm px-3 py-2 rounded-pill btn-glass fw-semibold"
                style={{ fontSize: '11px' }}
              >
                Track
              </Link>
              <Link
                to="/ballroom-booking"
                className="btn btn-sm px-3 py-2 rounded-pill btn-premium fw-bold"
                style={{ fontSize: '11px' }}
              >
                Ballroom
              </Link>
            </div>

            {/* Cart (Desktop only in Navbar) */}
            <button
              className="btn btn-dark btn-sm d-none d-md-flex align-items-center gap-2 border-0 rounded-3 p-2 px-3 cart-btn"
              style={{ backgroundColor: '#333333' }}
              onClick={onShowCart}
            >
              <div className="position-relative">
                <i className="bi bi-cart fs-5"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-white text-dark p-1 d-flex align-items-center justify-content-center" style={{ width: '16px', height: '16px', fontSize: '10px' }}>{cartCount}</span>
              </div>
              <span className="fw-bold ms-1" style={{ fontSize: '14px' }}>Cart</span>
            </button>

          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
