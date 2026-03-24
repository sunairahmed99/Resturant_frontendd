import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, updateBookingStatus, deleteBooking } from '../../redux/slices/bookingSlice';

const BookingManagement = () => {
    const dispatch = useDispatch();
    const { items: bookings, loading } = useSelector(state => state.bookings);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const handleStatusUpdate = (id, status) => {
        dispatch(updateBookingStatus({ id, status }));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            dispatch(deleteBooking(id));
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (filter === 'all') return true;
        return b.status === filter;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed': return 'badge bg-success';
            case 'cancelled': return 'badge bg-danger';
            default: return 'badge bg-warning text-dark';
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-white mb-1">Ballroom Bookings</h2>
                    <p className="text-muted small">Manage event space reservations and inquiries</p>
                </div>
                <div className="d-flex gap-2">
                    <select
                        className="form-select form-select-sm bg-dark text-white border-secondary border-opacity-25"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ width: '150px' }}
                    >
                        <option value="all">All Bookings</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="btn btn-primary-admin btn-sm" onClick={() => dispatch(fetchBookings())}>
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </button>
                </div>
            </div>

            <div className="admin-card p-0 overflow-hidden shadow-sm">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead className="bg-secondary bg-opacity-10 text-muted small uppercase tracking-wider">
                            <tr>
                                <th className="ps-4 py-3">Customer</th>
                                <th className="py-3">Event Details</th>
                                <th className="py-3">Guests</th>
                                <th className="py-3">Date & Time</th>
                                <th className="py-3">Status</th>
                                <th className="pe-4 py-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        No bookings found matching the criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="border-bottom border-secondary border-opacity-10">
                                        <td className="ps-4">
                                            <div className="fw-bold text-white">{booking.name}</div>
                                            <div className="small text-muted">{booking.phone}</div>
                                            <div className="small text-muted">{booking.email}</div>
                                        </td>
                                        <td>
                                            <div className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 mb-1">
                                                {booking.eventType}
                                            </div>
                                            <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }} title={booking.additionalRequests}>
                                                {booking.additionalRequests || 'No special requests'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="fw-normal">{booking.numberOfPeople} Guests</span>
                                        </td>
                                        <td>
                                            <div className="text-white">{formatDate(booking.eventDate)}</div>
                                            <div className="small text-muted">{booking.timeSlot}</div>
                                        </td>
                                        <td>
                                            <span className={getStatusBadgeClass(booking.status)}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="dropdown d-inline-block">
                                                <button className="btn btn-ghost btn-sm dropdown-toggle border-0" type="button" data-bs-toggle="dropdown">
                                                    Update Status
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-dark shadow">
                                                    <li><button className="dropdown-item small" onClick={() => handleStatusUpdate(booking._id, 'pending')}>Mark Pending</button></li>
                                                    <li><button className="dropdown-item small text-success" onClick={() => handleStatusUpdate(booking._id, 'confirmed')}>Confirm Booking</button></li>
                                                    <li><button className="dropdown-item small text-danger" onClick={() => handleStatusUpdate(booking._id, 'cancelled')}>Cancel Booking</button></li>
                                                </ul>
                                            </div>
                                            <button
                                                className="btn btn-icon btn-sm ms-2"
                                                onClick={() => handleDelete(booking._id)}
                                                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .admin-card { background: var(--card-bg); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
                .table-hover tbody tr:hover { background-color: rgba(255,255,255,0.02) !important; }
                .btn-ghost { color: var(--text-gray); }
                .btn-ghost:hover { color: white; background: rgba(255,255,255,0.05); }
                .dropdown-item:active { background-color: var(--primary-color); }
                .text-muted { color: white !important; }
                .table-dark { color: white !important; }
                td, th { color: white !important; }
            `}</style>
        </div>
    );
};

export default BookingManagement;
