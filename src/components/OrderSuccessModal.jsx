import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderSuccessModal = ({ show, onHide, orderNumber }) => {
    const navigate = useNavigate();
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            contentClassName="success-modal-content border-0 rounded-4 overflow-hidden bg-black text-white"
            style={{ backdropFilter: 'blur(8px)' }}
        >
            <Modal.Body className="p-5 text-center">
                <div className="mb-4">
                    <div className="success-icon-wrap mb-4 mx-auto">
                        <div className="success-icon">✓</div>
                    </div>
                    <h2 className="fw-bold mb-2">ORDER PLACED!</h2>
                    <p className="text-secondary mb-4">Your delicious meal is on its way.</p>

                    <div className="order-number-card p-3 rounded-3 mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <span className="text-secondary small text-uppercase fw-bold d-block mb-1">Order Number</span>
                        <h4 className="fw-bold text-danger mb-0">{orderNumber}</h4>
                    </div>

                    <p className="small text-muted mb-4">
                        A confirmation email has been sent to your inbox. You can track your order status in real-time.
                    </p>

                    <div className="d-flex flex-column gap-3 mt-4">
                        <button
                            className="btn btn-outline-danger w-100 py-3 fw-bold rounded-2 shadow-sm text-uppercase"
                            onClick={() => {
                                onHide();
                                navigate('/my-orders');
                            }}
                            style={{ letterSpacing: '1px' }}
                        >
                            Track My Order
                        </button>
                        <button
                            className="btn btn-danger w-100 py-3 fw-bold rounded-2 shadow-sm text-uppercase"
                            onClick={onHide}
                            style={{ letterSpacing: '1px' }}
                        >
                            Great, Thanks!
                        </button>
                    </div>
                </div>
            </Modal.Body>

            <style jsx>{`
                .success-icon-wrap {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #28a745, #20c997);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 30px rgba(40, 167, 69, 0.4);
                    animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .success-icon {
                    font-size: 40px;
                    color: white;
                    line-height: 1;
                }
                @keyframes scaleIn {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
                .success-modal-content {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </Modal>
    );
};

export default OrderSuccessModal;
