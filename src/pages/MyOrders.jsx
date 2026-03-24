import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/slices/myOrdersSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'warning';
        case 'Confirmed': return 'primary';
        case 'Preparing': return 'info';
        case 'Out for Delivery': return 'secondary';
        case 'Delivered': return 'success';
        case 'Cancelled':
        case 'Rejected': return 'danger';
        default: return 'light';
    }
};

const MyOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error, searched } = useSelector(state => state.myOrders);
    const [phone, setPhone] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (phone.trim()) {
            dispatch(fetchMyOrders(phone.trim()));
        }
    };

    return (
        <div className="home-page bg-pattern min-vh-100 d-flex flex-column text-white">
            <Navbar />
            <div className="flex-grow-1 container pb-5" style={{ paddingTop: '100px' }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px', color: '#ff0000' }}>Track Your Orders</h2>
                            <p className="text-secondary">Enter the phone number you used during checkout to see your order history and live status.</p>
                        </div>

                        <form onSubmit={handleSearch} className="mb-5">
                            <div className="input-group input-group-lg shadow-lg" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                <span className="input-group-text bg-dark border-secondary border-opacity-25 border-end-0 text-white">
                                    <i className="bi bi-telephone-fill pt-1"></i>
                                </span>
                                <input
                                    type="tel"
                                    className="form-control bg-dark text-white border-main border-secondary border-opacity-25 border-start-0 py-3 ps-0"
                                    style={{ 'boxShadow': 'none' }}
                                    placeholder="Phone number (e.g. 03XXXXXXXXX)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <button type="submit" className="btn btn-danger px-4 fw-bold text-uppercase" disabled={loading || !phone.trim()}>
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-danger border-opacity-25">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                            </div>
                        )}

                        {searched && !loading && orders.length === 0 && !error && (
                            <div className="text-center py-5 bg-dark bg-opacity-50 rounded-4 border border-secondary border-opacity-25">
                                <i className="bi bi-box-seam text-secondary mb-3 pt-4" style={{ fontSize: '4rem' }}></i>
                                <h5>No orders found</h5>
                                <p className="text-muted pb-4">We couldn't find any orders linked to {phone}</p>
                            </div>
                        )}

                        {orders.length > 0 && (
                            <div className="orders-list">
                                <h5 className="fw-bold mb-4 border-bottom border-secondary border-opacity-25 pb-2">Your Order History</h5>
                                {orders.map(order => (
                                    <div key={order._id} className="card bg-dark bg-opacity-75 border-secondary border-opacity-25 rounded-4 mb-4 shadow-sm overflow-hidden">
                                        <div className="card-header border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center py-3 px-4">
                                            <div>
                                                <div className="text-secondary small fw-bold text-uppercase mb-1">Order Number</div>
                                                <div className="fw-bold fs-5 text-white">{order.orderNumber}</div>
                                            </div>
                                            <div className="text-end">
                                                <span className={`badge bg-${getStatusColor(order.status)} px-3 py-2 rounded-pill fw-bold`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-body px-4 py-3">
                                            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-10">
                                                <div>
                                                    <div className="text-secondary small mb-1">Date Placed</div>
                                                    <div className="fw-semibold text-white">{new Date(order.createdAt).toLocaleString()}</div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-secondary small mb-1">Destination</div>
                                                    <div className="fw-semibold text-white">
                                                        <i className={`bi bi-${order.category === 'pickup' ? 'shop' : 'geo-alt-fill'} text-danger me-1`}></i>
                                                        {order.branch}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="items-list pt-2">
                                                <div className="text-secondary small mb-3 fw-bold text-uppercase">Items</div>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                                                        <div>
                                                            <span className="badge bg-secondary bg-opacity-25 text-white me-2">{item.quantity}x</span>
                                                            <span className="fw-medium text-white">{item.name}</span>
                                                        </div>
                                                        <div className="text-muted small">Rs. {item.totalPrice}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="card-footer border-top border-secondary border-opacity-25 px-4 py-3 bg-black bg-opacity-25">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="text-secondary small">Delivery Fee: Rs. {order.deliveryFee}</div>
                                                <div className="fs-5 fw-bold text-danger">Total: Rs. {order.grandTotal}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyOrders;
