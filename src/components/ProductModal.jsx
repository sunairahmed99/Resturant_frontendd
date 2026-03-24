import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/slices/cartSlice';

const ProductModal = ({ show, onHide, product }) => {
    const [quantity, setQuantity] = useState(1);
    const [instructions, setInstructions] = useState('');
    const dispatch = useDispatch();

    if (!product) return null;

    const handleAddToCart = () => {
        dispatch(addItem({
            id: product.id || product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity,
            instructions: instructions
        }));
        onHide();
        setQuantity(1);
        setInstructions('');
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            contentClassName="product-modal-content border-0 rounded-4 overflow-hidden"
        >
            <Modal.Body className="p-0 position-relative">
                {/* Close & Share Buttons */}
                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2" style={{ zIndex: 10 }}>
                    <button className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: 'black' }}>
                        <i className="bi bi-share-fill small"></i>
                    </button>
                    <button className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: 'black' }} onClick={onHide}>
                        <i className="bi bi-x-lg fw-bold"></i>
                    </button>
                </div>

                <div className="row g-0">
                    {/* Left Side: Image & Description */}
                    <div className="col-lg-5 col-md-12 p-0">
                        <div className="product-image-container h-100">
                            <img
                                src={product.image || 'https://via.placeholder.com/600?text=Food'}
                                alt={product.name}
                                className="w-100 h-100 object-fit-cover"
                                style={{ minHeight: '300px' }}
                            />
                        </div>
                    </div>

                    {/* Right Side: Details & Instructions */}
                    <div className="col-lg-7 col-md-12 bg-white text-dark d-flex flex-column">
                        <div className="p-4 flex-grow-1">
                            <h4 className="fw-bold mb-2">{product.name}</h4>
                            <p className="text-secondary mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                {product.description || "Includes Cheese Kebab, Mutton Kebab, Malai Kebab, Chandan Kebab, Chullu Kebab, and Reshmi Kebab — with Aromatic Pulao, Grilled Tomatoes and Chilies, and our famous Imli Chatni."}
                            </p>

                            <div className="special-instructions">
                                <label className="form-label fw-bold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Special Instructions</label>
                                <textarea
                                    className="form-control bg-light border-0 p-3 rounded-3"
                                    rows="4"
                                    placeholder="Please enter instructions about this item"
                                    style={{ fontSize: '14px', resize: 'none' }}
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="p-4 border-top d-flex align-items-center justify-content-between gap-3">
                            <div className="quantity-selector d-flex align-items-center bg-light rounded-pill px-2 py-1 gap-3">
                                <button className="btn btn-sm p-0 fs-5 fw-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span className="fw-bold" style={{ width: '20px', textAlign: 'center' }}>{quantity}</span>
                                <button className="btn btn-sm p-0 fs-5 fw-bold" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>

                            <button
                                className="btn btn-dark flex-grow-1 py-3 rounded-2 fw-bold d-flex justify-content-between align-items-center px-4"
                                style={{ backgroundColor: 'black', fontSize: '14px' }}
                                onClick={handleAddToCart}
                            >
                                <span>Add to Cart</span>
                                <span>Rs. {product.price * quantity}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ProductModal;
