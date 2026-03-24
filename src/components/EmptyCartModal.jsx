import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EmptyCartModal = ({ show, onHide }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            contentClassName="bg-dark text-white border-0 shadow-lg rounded-4"
        >
            <Modal.Body className="text-center p-5">
                <div className="mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mb-3" style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-cart-x fs-1"></i>
                    </div>
                    <h3 className="fw-bold mb-2">Your Cart is Empty!</h3>
                    <p className="text-muted">Browse our delicious menu and add some items to your cart to continue with your order.</p>
                </div>
                <Button
                    variant="danger"
                    className="w-100 py-3 fw-bold rounded-3 shadow-sm border-0"
                    onClick={onHide}
                    style={{ background: 'linear-gradient(135deg, #C02221, #8b1a19)' }}
                >
                    Start Ordering
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default EmptyCartModal;
