import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches } from '../redux/slices/branchSlice';

const Footer = ({ onShowCart }) => {
    const dispatch = useDispatch();
    const { items: cartItems, totalAmount } = useSelector(state => state.cart);
    const { items: branches } = useSelector(state => state.branches);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        if (branches.length === 0) {
            dispatch(fetchBranches());
        }
    }, [dispatch, branches.length]);

    return (
        <footer className="footer-container bg-black text-white pt-5 pb-0 position-relative">
            <div className="container-fluid px-5 pb-5">
                <div className="row align-items-center">
                    <div className="col-md-4 mb-4 mb-md-0 d-flex justify-content-center justify-content-md-start">
                        <div className="logo-wrapper position-relative">
                            <h1 className="fw-bold text-danger m-0 text-nowrap" style={{ letterSpacing: '2px', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>ZEST & ZEST</h1>
                            <div className="sword-line"></div>
                        </div>
                    </div>

                    {/* Contact Details Section */}
                    <div className="col-md-5 mb-4 mb-md-0 px-md-5 text-center text-md-start">
                        <div className="contact-info small">
                            <p className="mb-2"><span className="fw-bold">Phone:</span> +923342845479</p>
                            <p className="mb-3"><span className="fw-bold">Email:</span> zestandzest.food@gmail.com</p>

                            {branches.filter(b => b.isActive).map((b, idx) => (
                                <p key={b._id} className={`${idx === branches.length - 1 ? 'mb-0' : 'mb-1'} fw-bold`}>
                                    {b.name}: <span className="fw-normal">{b.address}</span>
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Socials Section */}
                    <div className="col-md-3 text-center text-md-start ps-md-5">
                        <h5 className="fw-bold mb-3">Follow Us</h5>
                        <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-5">
                            <i className="bi bi-facebook pointer"></i>
                            <i className="bi bi-instagram pointer"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thin Separator Line */}
            <hr className="border-secondary m-0" style={{ opacity: '0.3' }} />

            {/* Bottom Status Bar / Sticky Cart (Mobile & Desktop Floating) */}
            <div
                className="bottom-cart-bar bg-black text-white px-4 py-2 d-flex justify-content-between align-items-center pointer rounded-pill"
                onClick={onShowCart}
                style={{ minWidth: '320px' }}
            >
                <div className="d-flex align-items-center gap-3">
                    <div className="cart-count-badge d-flex align-items-center justify-content-center fw-bold" style={{ border: '2px solid white', borderRadius: '50%', width: '28px', height: '28px', fontSize: '14px' }}>{cartCount}</div>
                </div>

                <div className="fw-bold flex-grow-1 text-center" style={{ fontSize: '15px', letterSpacing: '0.5px' }}>
                    View Cart
                </div>

                <div className="fw-bold" style={{ fontSize: '15px' }}>
                    Rs. {totalAmount}
                </div>
            </div>

            {/* WhatsApp and Top button handled by CSS fixed positioning */}
            <a href="https://wa.me/923342845479" target="_blank" rel="noopener noreferrer" className="whatsapp-btn shadow-lg">
                <i className="bi bi-whatsapp"></i>
            </a>
            <button className="top-btn shadow-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <i className="bi bi-arrow-up-short"></i>
            </button>
        </footer>
    );
};

export default Footer;
