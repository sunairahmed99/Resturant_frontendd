import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';
import OrderSuccessModal from './OrderSuccessModal';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^(\+92|0|92)?(3\d{9})$/, 'Invalid Pakistani phone number (e.g. 03XXXXXXXXX)'),
    address: z.string().min(10, 'Please provide a detailed address'),
    instructions: z.string().optional(),
});

const CheckoutModal = ({ show, onHide, deliveryInfo = {} }) => {
    const dispatch = useDispatch();
    const { items, totalAmount } = useSelector(state => state.cart);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [placedOrderNumber, setPlacedOrderNumber] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            instructions: ''
        }
    });

    const { orderType = 'delivery', area = '', branch = '' } = deliveryInfo;

    const deliveryFee = (totalAmount > 0 && orderType === 'delivery') ? 100 : 0;
    const grandTotal = totalAmount + deliveryFee;

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const resolvedBranch = orderType === 'pickup' ? branch : (area || 'Delivery Order');
            const orderData = { ...data, items, totalAmount, deliveryFee, grandTotal, branch: resolvedBranch, orderType };
            const result = await dispatch(createOrder(orderData)).unwrap();

            if (result?.success || result?.order) {
                setPlacedOrderNumber(result?.order?.orderNumber || 'N/A');
                setShowSuccessModal(true);
                dispatch(clearCart());
                reset();
                onHide();
            }
        } catch (error) {
            alert(error?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            contentClassName="checkout-modal-content border-0 rounded-4 overflow-hidden bg-black text-white"
        >
            <Modal.Header className="border-secondary border-opacity-25 py-3">
                <Modal.Title className="fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Complete Your Order</Modal.Title>
                <button className="btn btn-link text-white p-0 fs-4" onClick={onHide} style={{ textDecoration: 'none' }}>✕</button>
            </Modal.Header>
            {/* Delivery Info Badge */}
            {(area || branch) && (
                <div className="px-4 py-2 d-flex align-items-center gap-2" style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <i className={`bi bi-${orderType === 'pickup' ? 'shop' : 'geo-alt-fill'} text-danger`}></i>
                    <span className="fw-bold text-white" style={{ fontSize: '13px' }}>
                        {orderType === 'pickup' ? `Pickup: ${branch}` : `Delivery to: ${area}`}
                    </span>
                </div>
            )}
            <Modal.Body className="p-0">
                <div className="row g-0">
                    {/* Left Side: Order Summary */}
                    <div className="col-lg-5 col-md-12 p-4 bg-dark bg-opacity-50">
                        <h6 className="fw-bold mb-4 text-secondary text-uppercase small" style={{ letterSpacing: '2px' }}>Order Summary</h6>
                        <div className="checkout-items-list mb-4 mt-4 pt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {items.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="position-relative">
                                            <img src={item.image?.url || item.image || 'https://via.placeholder.com/50'} alt={item.name} className="rounded-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>{item.quantity}</span>
                                        </div>
                                        <div>
                                            <div className="fw-bold small">{item.name}</div>
                                            {item.instructions && <div className="text-secondary" style={{ fontSize: '10px' }}>{item.instructions}</div>}
                                        </div>
                                    </div>
                                    <div className="fw-bold small">Rs. {item.totalPrice}</div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-details pt-3 border-top border-secondary border-opacity-25">
                            <div className="d-flex justify-content-between mb-2 small text-secondary">
                                <span>Subtotal</span>
                                <span>Rs. {totalAmount}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 small text-secondary">
                                <span>Delivery Fee</span>
                                <span>Rs. {deliveryFee}</span>
                            </div>
                            <hr className="border-secondary border-opacity-25" />
                            <div className="d-flex justify-content-between mb-0">
                                <h5 className="fw-bold">Total</h5>
                                <h5 className="fw-bold text-danger">Rs. {grandTotal}</h5>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Shipping Form */}
                    <div className="col-lg-7 col-md-12 p-4 bg-white text-dark">
                        <h6 className="fw-bold mb-4 text-secondary text-uppercase small" style={{ letterSpacing: '2px' }}>Shipping Information</h6>
                        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Full Name</label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Phone Number</label>
                                <input
                                    type="tel"
                                    {...register('phone')}
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    placeholder="03XXXXXXXXX"
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-bold">Email Address</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-bold">Delivery Address</label>
                                <textarea
                                    {...register('address')}
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    rows="3"
                                    placeholder="House #, Street, Area..."
                                ></textarea>
                                {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-bold">Order Instructions (Optional)</label>
                                <textarea
                                    {...register('instructions')}
                                    className="form-control"
                                    rows="2"
                                    placeholder="Gate code, allergies, etc."
                                ></textarea>
                            </div>
                            <div className="col-12 mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-danger w-100 py-3 fw-bold rounded-2 shadow-sm text-uppercase"
                                    style={{ letterSpacing: '1px' }}
                                >
                                    {loading ? 'Placing Order...' : `Place Order Rs. ${grandTotal}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal.Body>
            <OrderSuccessModal
                show={showSuccessModal}
                onHide={() => setShowSuccessModal(false)}
                orderNumber={placedOrderNumber}
            />
        </Modal>
    );
};

export default CheckoutModal;
