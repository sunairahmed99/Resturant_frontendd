import React, { useState, useRef, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeItem, clearCart, addItem } from '../redux/slices/cartSlice';
import { validateCoupon, removeCoupon, clearCouponErrors } from '../redux/slices/couponSlice';
import { fetchSettings } from '../redux/slices/settingsSlice';
import { fetchBranches } from '../redux/slices/branchSlice';
const CartDrawer = ({ show, onHide, onCheckout, allProducts = [] }) => {
    const dispatch = useDispatch();
    const { items: cartItems, totalAmount } = useSelector(state => state.cart);
    const { appliedCoupon, validateLoading, validateError } = useSelector(state => state.coupons);
    const { items: branchesList } = useSelector(state => state.branches);
    const { data: settings } = useSelector(state => state.settings);

    const info = settings?.restaurantInfo || {};

    const [couponCode, setCouponCode] = useState('');
    const [orderType, setOrderType] = React.useState('delivery');
    const [searchTerm, setSearchTerm] = useState('');
    const [branchSearchTerm, setBranchSearchTerm] = useState('');
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [addressError, setAddressError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const handleUpdateQuantity = (id, instructions, type) => {
        dispatch(updateQuantity({ id, instructions, type }));
    };

    const handleRemoveItem = (id, instructions) => {
        dispatch(removeItem({ id, instructions }));
    };

    const handleClearCart = () => {
        if (window.confirm('Clear all items from cart?')) {
            dispatch(clearCart());
        }
    };

    const addresses = [
        "BUFFER ZONE BLOCK 15-A5",
        "Buffer Zone 15-A/4",
        "Bufferzone 15A 1",
        "Bufferzone 15A 2",
        "Bufferzone 15A 3",
        "Bufferzone 15b"
    ];

    const activeBranches = branchesList.filter(b => b.isActive).map(b => b.name);

    const filteredAddresses = addresses.filter(addr =>
        addr.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBranches = activeBranches.filter(branch =>
        branch.toLowerCase().includes(branchSearchTerm.toLowerCase())
    );

    useEffect(() => {
        if (show) {
            dispatch(fetchBranches());
            dispatch(fetchSettings());
            // Note: areas fetch is not currently used in this local addresses array, 
            // but kept for future dynamic area integration if needed or just skip if unnecessary.
        }
    }, [show, dispatch]);

    const isRestaurantOpen = () => {
        if (!info.openingTime || !info.closingTime) return true;

        const parseTime = (timeStr) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            return hours * 60 + (minutes || 0);
        };

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const openTime = parseTime(info.openingTime);
        const closeTime = parseTime(info.closingTime);

        if (closeTime > openTime) {
            return currentTime >= openTime && currentTime <= closeTime;
        } else {
            // Over midnight case (e.g., 4 PM to 2 AM)
            return currentTime >= openTime || currentTime <= closeTime;
        }
    };

    const isShopOpen = isRestaurantOpen();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const lastItem = cartItems[cartItems.length - 1];
    const currentCategoryId = typeof lastItem?.category === 'object' ? lastItem.category._id : lastItem?.category;

    const recommendations = allProducts
        .filter(p => {
            const pCatId = typeof p.category === 'object' ? p.category._id : p.category;
            return pCatId === currentCategoryId && !cartItems.find(item => item.id === (p._id || p.id));
        })
        .slice(0, 8);

    const defaultRecommendations = [
        { name: "Isfahani Boti", price: 900, image: "https://images.unsplash.com/photo-1544025162-8356fd105161?auto=format&fit=crop&w=200&q=80" },
        { name: "Fries", price: 330, image: "https://images.unsplash.com/photo-1626082895617-2c6b4458f4fb?auto=format&fit=crop&w=200&q=80" },
        { name: "Shahi Tikka", price: 530, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80" }
    ];

    const displayRecommendations = recommendations.length > 0 ? recommendations : defaultRecommendations;

    const handleAddRecommendation = (rec) => {
        dispatch(addItem({
            id: rec._id || rec.id || Math.random().toString(36).substr(2, 9),
            name: rec.name,
            price: rec.price,
            image: rec.image?.url || rec.image,
            category: rec.category,
            quantity: 1,
            instructions: ''
        }));
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;
        dispatch(validateCoupon({ code: couponCode, orderAmount: totalAmount }));
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCouponCode('');
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.discountType === 'percentage') {
            return (totalAmount * appliedCoupon.discountValue) / 100;
        } else {
            return appliedCoupon.discountValue;
        }
    };

    const discount = calculateDiscount();
    const deliveryFee = (totalAmount > 0 && orderType === 'delivery') ? (Number(info.deliveryFee) || 0) : 0;
    const grandTotal = Math.max(0, totalAmount + deliveryFee - discount);

    return (
        <Offcanvas
            show={show}
            onHide={onHide}
            placement="end"
            className="cart-drawer text-white"
            style={{ width: '100%', maxWidth: '450px', backgroundColor: 'var(--cart-grey-bg)' }}
        >
            <Offcanvas.Header className="px-3 pt-3 pb-2 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
                <h4 className="fw-bold m-0">Your Cart</h4>
                <div className="d-flex align-items-center gap-3">
                    <button
                        className="btn btn-dark btn-sm rounded-pill px-3 py-1 fw-bold"
                        style={{ fontSize: '10px', backgroundColor: '#444', border: '1px solid #555' }}
                        onClick={handleClearCart}
                    >
                        Clear Cart
                    </button>
                    <button className="btn p-0 text-white fs-4" onClick={onHide}>
                        <i className="bi bi-x-circle-fill opacity-75"></i>
                    </button>
                </div>
            </Offcanvas.Header>

            <Offcanvas.Body className="px-3 pt-0" style={{ overflowX: 'hidden' }}>
                {/* Cart Items */}
                <div className="cart-items-container py-3">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-5 opacity-50">Your cart is empty</div>
                    ) : (
                        cartItems.map(item => (
                            <div key={`${item.id}-${item.instructions}`} className="cart-item d-flex align-items-center gap-3 p-2 rounded-3 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <img src={item.image?.url || item.image || "https://placehold.co/100x100?text=Item"} alt={item.name} className="rounded-3 object-fit-cover" style={{ width: '60px', height: '60px' }} />
                                <div className="flex-grow-1">
                                    <h6 className="fw-bold m-0" style={{ fontSize: '14px' }}>{item.name}</h6>
                                    {item.instructions && (
                                        <p className="m-0 text-warning italic" style={{ fontSize: '11px' }}>"{item.instructions}"</p>
                                    )}
                                    <p className="text-secondary m-0 fw-bold" style={{ fontSize: '13px' }}>Rs.{item.price}</p>
                                </div>
                                <div className="d-flex align-items-center border border-secondary border-opacity-25 rounded-pill px-2 py-1 gap-3" style={{ backgroundColor: '#444' }}>
                                    <i
                                        className={`bi ${item.quantity > 1 ? 'bi-dash text-white' : 'bi-trash3-fill text-danger'}`}
                                        style={{ fontSize: '12px', cursor: 'pointer' }}
                                        onClick={() => item.quantity > 1 ? handleUpdateQuantity(item.id, item.instructions, 'decrement') : handleRemoveItem(item.id, item.instructions)}
                                    ></i>
                                    <span className="fw-bold" style={{ fontSize: '14px' }}>{item.quantity}</span>
                                    <i
                                        className="bi bi-plus text-white shadow-sm"
                                        style={{ fontSize: '16px', cursor: 'pointer' }}
                                        onClick={() => handleUpdateQuantity(item.id, item.instructions, 'increment')}
                                    ></i>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add More Items Button */}
                <button className="btn btn-outline-secondary w-100 py-2 border-dashed rounded-3 text-white opacity-75 mb-4" style={{ borderStyle: 'dashed', fontSize: '14px' }} onClick={onHide}>
                    <i className="bi bi-plus me-2"></i> Add More Items
                </button>

                {/* Popular Section */}
                <div className="popular-section mb-4 pt-1">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                        <div>
                            <h6 className="fw-bold m-0 text-white" style={{ fontSize: '15px' }}>Popular with your order</h6>
                            <p className="text-secondary m-0" style={{ fontSize: '11px' }}>Customers often buy these together</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center border-0 p-0"
                                style={{ width: '28px', height: '28px', backgroundColor: '#333' }}
                                onClick={() => scroll('left')}
                            >
                                <i className="bi bi-chevron-left" style={{ fontSize: '12px' }}></i>
                            </button>
                            <button
                                className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center border-0 p-0"
                                style={{ width: '28px', height: '28px', backgroundColor: '#333' }}
                                onClick={() => scroll('right')}
                            >
                                <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
                            </button>
                        </div>
                    </div>
                    <div className="recommendations-container position-relative">
                        <div
                            ref={scrollRef}
                            className="recommendations-scroll d-flex gap-3 overflow-auto pb-2 custom-scrollbar"
                        >
                            {displayRecommendations.map((rec, i) => (
                                <div key={i} className="rec-card flex-shrink-0 bg-dark bg-opacity-25 rounded-3 p-2 border border-secondary border-opacity-10" style={{ width: '130px', transition: 'transform 0.2s' }}>
                                    <div className="position-relative mb-2 rounded-3 overflow-hidden" style={{ height: '90px' }}>
                                        <img src={rec.image?.url || rec.image} alt={rec.name} className="w-100 h-100 object-fit-cover" />
                                        <button
                                            className="position-absolute bottom-0 end-0 m-1 btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                                            style={{ width: '22px', height: '22px', border: 'none' }}
                                            onClick={() => handleAddRecommendation(rec)}
                                        >
                                            <i className="bi bi-plus fs-6"></i>
                                        </button>
                                    </div>
                                    <div className="px-1 text-truncate">
                                        <p className="text-white fw-bold m-0 text-truncate" style={{ fontSize: '11px' }}>{rec.name}</p>
                                        <h6 className="text-danger fw-bold m-0" style={{ fontSize: '12px' }}>Rs.{rec.price}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="summary-section pt-3 pb-3">
                    {/* Coupon Section */}
                    <div className="coupon-section mb-4">
                        <label className="text-secondary fw-bold mb-2 d-block" style={{ fontSize: '12px' }}>DISCOUNT CODE</label>
                        {!appliedCoupon ? (
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control bg-dark text-white border-secondary border-opacity-25 py-2 px-3 fw-bold"
                                    style={{ fontSize: '13px', letterSpacing: '1px' }}
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => {
                                        setCouponCode(e.target.value.toUpperCase());
                                        dispatch(clearCouponErrors());
                                    }}
                                />
                                <button
                                    className="btn btn-danger px-4 fw-bold"
                                    style={{ fontSize: '12px' }}
                                    onClick={handleApplyCoupon}
                                    disabled={validateLoading || !couponCode}
                                >
                                    {validateLoading ? '...' : 'APPLY'}
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-between align-items-center bg-success bg-opacity-10 p-2 px-3 rounded-3 border border-success border-opacity-25">
                                <div>
                                    <span className="text-success fw-bold small me-2">{appliedCoupon.code}</span>
                                    <span className="text-muted tiny-text">Coupon Applied</span>
                                </div>
                                <button className="btn btn-sm p-0 border-0 text-danger" onClick={handleRemoveCoupon}>
                                    <i className="bi bi-x-circle-fill"></i>
                                </button>
                            </div>
                        )}
                        {validateError && <p className="text-danger tiny-text mt-1 ms-1">{validateError}</p>}
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary fw-bold" style={{ fontSize: '14px' }}>Subtotal</span>
                        <span className="fw-bold" style={{ fontSize: '14px' }}>Rs. {totalAmount}</span>
                    </div>
                    {appliedCoupon && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                            <span className="fw-bold" style={{ fontSize: '14px' }}>Discount</span>
                            <span className="fw-bold" style={{ fontSize: '14px' }}>- Rs. {discount}</span>
                        </div>
                    )}
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary fw-bold" style={{ fontSize: '14px' }}>Delivery fee</span>
                        <span className="fw-bold" style={{ fontSize: '14px' }}>Rs. {deliveryFee}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 mt-1">
                        <h5 className="fw-bold m-0 text-white">Grand Total</h5>
                        <h5 className="fw-bold m-0 text-white">Rs. {grandTotal}</h5>
                    </div>

                    {!isShopOpen && (
                        <p className="text-danger text-center fw-bold mb-3" style={{ fontSize: '13px' }}>Branch near to this area is closed.</p>
                    )}

                    {/* Delivery Toggle */}
                    <div className="delivery-toggle d-flex bg-dark p-1 rounded-3 mb-3 border border-secondary border-opacity-25" style={{ backgroundColor: '#111' }}>
                        <button
                            className={`btn btn-sm flex-grow-1 fw-bold py-2 rounded-3 border-0 ${orderType === 'delivery' ? 'bg-white text-black' : 'text-white'}`}
                            style={{ fontSize: '12px', transition: 'all 0.2s', opacity: orderType === 'delivery' ? 1 : 0.6 }}
                            onClick={() => {
                                setOrderType('delivery');
                                setIsOpen(false);
                                setSelectedBranch(null);
                                setBranchSearchTerm('');
                                setAddressError('');
                            }}
                        >
                            DELIVERY
                        </button>
                        <button
                            className={`btn btn-sm flex-grow-1 fw-bold py-2 rounded-3 border-0 ${orderType === 'pickup' ? 'bg-white text-black' : 'text-white'}`}
                            style={{ fontSize: '12px', transition: 'all 0.2s', opacity: orderType === 'pickup' ? 1 : 0.6 }}
                            onClick={() => {
                                setOrderType('pickup');
                                setIsOpen(false);
                                setSelectedArea(null);
                                setSearchTerm('');
                                setAddressError('');
                            }}
                        >
                            PICKUP
                        </button>
                    </div>

                    {/* Searchable Location/Branch Dropdown */}
                    <div className="location-selector position-relative mt-2" ref={dropdownRef}>
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control bg-white text-dark fw-bold py-2 px-3 rounded-2 shadow-sm w-100"
                                style={{ fontSize: '13px', border: '1px solid #ddd', cursor: 'pointer' }}
                                placeholder={orderType === 'delivery' ? "Search address..." : "select pickup branch"}
                                value={orderType === 'delivery' ? searchTerm : branchSearchTerm}
                                onFocus={() => setIsOpen(true)}
                                onChange={(e) => {
                                    if (orderType === 'delivery') {
                                        setSearchTerm(e.target.value);
                                    } else {
                                        setBranchSearchTerm(e.target.value);
                                    }
                                }}
                            />
                            <i
                                className={`bi bi-chevron-${isOpen ? 'up' : 'down'} position-absolute top-50 end-0 translate-middle-y me-3 text-dark fs-6`}
                                style={{ pointerEvents: 'none' }}
                            ></i>
                        </div>

                        {isOpen && (
                            <div
                                className="dropdown-menu show w-100 mt-1 border-0 shadow-lg rounded-2 overflow-auto"
                                style={{
                                    maxHeight: '200px',
                                    backgroundColor: 'white',
                                    zIndex: 1000,
                                    position: 'absolute',
                                    left: 0,
                                    right: 0
                                }}
                            >
                                {orderType === 'delivery' ? (
                                    filteredAddresses.length > 0 ? (
                                        filteredAddresses.map((addr, index) => (
                                            <div
                                                key={index}
                                                className="dropdown-item py-2 px-3 fw-semibold pointer text-dark"
                                                style={{ fontSize: '13px', borderBottom: '1px solid #f8f9fa', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setSearchTerm(addr);
                                                    setSelectedArea(addr);
                                                    setAddressError('');
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {addr}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-muted italic small">No addresses found</div>
                                    )
                                ) : (
                                    filteredBranches.length > 0 ? (
                                        filteredBranches.map((branch, index) => (
                                            <div
                                                key={index}
                                                className="dropdown-item py-2 px-3 fw-semibold pointer text-dark"
                                                style={{ fontSize: '13px', borderBottom: '1px solid #f8f9fa', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setBranchSearchTerm(branch);
                                                    setSelectedBranch(branch);
                                                    setAddressError('');
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {branch}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-muted italic small">No branches found</div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Address validation error */}
                    {addressError && (
                        <p className="text-danger fw-bold text-center mt-3 mb-0" style={{ fontSize: '13px' }}>
                            ⚠️ {addressError}
                        </p>
                    )}

                    {/* Checkout Button */}
                    <button
                        className="btn btn-danger w-100 py-3 mt-3 fw-bold rounded-3 shadow-lg checkout-btn"
                        style={{
                            backgroundColor: '#ff0000',
                            border: 'none',
                            fontSize: '16px',
                            letterSpacing: '1px',
                            transition: 'all 0.3s'
                        }}
                        disabled={cartItems.length === 0 || !isShopOpen}
                        onClick={() => {
                            if (orderType === 'delivery' && !selectedArea) {
                                setAddressError('Please select a delivery area from the dropdown.');
                                return;
                            }
                            if (orderType === 'pickup' && !selectedBranch) {
                                setAddressError('Please select a pickup branch from the dropdown.');
                                return;
                            }
                            setAddressError('');
                            onCheckout({ orderType, area: selectedArea, branch: selectedBranch });
                        }}
                    >
                        {isShopOpen ? 'CHECKOUT' : 'CLOSED'}
                    </button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CartDrawer;
