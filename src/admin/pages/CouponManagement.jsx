import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, createCoupon, deleteCoupon, clearCouponErrors } from '../../redux/slices/couponSlice';

const CouponManagement = () => {
    const dispatch = useDispatch();
    const { items: coupons, loading, error } = useSelector(state => state.coupons);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        expiryDate: '',
        usageLimit: '100',
        isActive: true
    });

    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(createCoupon(formData));
        if (!result.error) {
            setShowAddForm(false);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                minOrderAmount: '',
                expiryDate: '',
                usageLimit: '100',
                isActive: true
            });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            dispatch(deleteCoupon(id));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-white mb-1">Coupon Management</h2>
                    <p className="text-muted small">Create and manage discount codes for customers</p>
                </div>
                <button
                    className="btn btn-primary-admin btn-sm px-4"
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        dispatch(clearCouponErrors());
                    }}
                >
                    {showAddForm ? 'Cancel' : '+ Create Coupon'}
                </button>
            </div>

            {showAddForm && (
                <div className="admin-card p-4 mb-4 shadow-sm reveal visible">
                    <h5 className="text-white mb-4 fw-bold">New Coupon</h5>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label text-muted small uppercase fw-bold tracking-wider">Coupon Code</label>
                            <input
                                type="text"
                                name="code"
                                required
                                className="form-control bg-dark text-white border-secondary border-opacity-25"
                                placeholder="E.G. SAVE20"
                                value={formData.code}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-muted small uppercase fw-bold tracking-wider">Discount Type</label>
                            <select
                                name="discountType"
                                className="form-select bg-dark text-white border-secondary border-opacity-25"
                                value={formData.discountType}
                                onChange={handleChange}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (Rs.)</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-muted small uppercase fw-bold tracking-wider">Discount Value</label>
                            <input
                                type="number"
                                name="discountValue"
                                required
                                className="form-control bg-dark text-white border-secondary border-opacity-25"
                                placeholder={formData.discountType === 'percentage' ? '20%' : '500'}
                                value={formData.discountValue}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-muted small uppercase fw-bold tracking-wider">Min Order Amount</label>
                            <input
                                type="number"
                                name="minOrderAmount"
                                className="form-control bg-dark text-white border-secondary border-opacity-25"
                                placeholder="0"
                                value={formData.minOrderAmount}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-muted small uppercase fw-bold tracking-wider">Expiry Date</label>
                            <input
                                type="date"
                                name="expiryDate"
                                required
                                className="form-control bg-dark text-white border-secondary border-opacity-25"
                                value={formData.expiryDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-muted small uppercase fw-bold tracking-wider">Usage Limit</label>
                            <input
                                type="number"
                                name="usageLimit"
                                className="form-control bg-dark text-white border-secondary border-opacity-25"
                                value={formData.usageLimit}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12 mt-4 text-end">
                            {error && <p className="text-danger small mb-3">{error}</p>}
                            <button type="submit" className="btn btn-danger px-5 py-2 fw-bold rounded-3">Save Coupon</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-card p-0 overflow-hidden shadow-sm">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead className="bg-secondary bg-opacity-10 text-muted small uppercase">
                            <tr>
                                <th className="ps-4 py-3">Code</th>
                                <th className="py-3">Discount</th>
                                <th className="py-3">Min Order</th>
                                <th className="py-3">Usage</th>
                                <th className="py-3">Expiry</th>
                                <th className="py-3">Status</th>
                                <th className="pe-4 py-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                            ) : coupons.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-5 text-muted">No coupons found.</td></tr>
                            ) : (
                                coupons.map(coupon => (
                                    <tr key={coupon._id} className="border-bottom border-secondary border-opacity-10">
                                        <td className="ps-4">
                                            <span className="fw-bold text-white badge bg-white bg-opacity-10 py-2 px-3">{coupon.code}</span>
                                        </td>
                                        <td>
                                            <span className="text-white">
                                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs.${coupon.discountValue}`}
                                            </span>
                                        </td>
                                        <td>Rs.{coupon.minOrderAmount}</td>
                                        <td>{coupon.usedCount} / {coupon.usageLimit}</td>
                                        <td>{formatDate(coupon.expiryDate)}</td>
                                        <td>
                                            <span className={`badge ${coupon.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <button
                                                className="btn btn-icon btn-sm"
                                                onClick={() => handleDelete(coupon._id)}
                                                style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
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
                .btn-primary-admin { background-color: var(--primary-color); color: white; border: none; }
                .btn-primary-admin:hover { opacity: 0.9; }
                .uppercase { text-transform: uppercase; }
                .tracking-wider { letter-spacing: 0.1em; }
                .text-muted { color: white !important; }
                .table-dark { color: white !important; }
                td, th { color: white !important; }
            `}</style>
        </div>
    );
};

export default CouponManagement;
