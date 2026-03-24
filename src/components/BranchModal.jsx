import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches } from '../redux/slices/branchSlice';
import { fetchAreas } from '../redux/slices/areaSlice';

const BranchModal = ({ show, onSelect }) => {
    const dispatch = useDispatch();
    const { items: branchesList } = useSelector(state => state.branches);
    const { items: areasList } = useSelector(state => state.areas);

    const [orderType, setOrderType] = useState('DELIVERY');
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (show) {
            dispatch(fetchBranches());
            dispatch(fetchAreas());
        }
    }, [show, dispatch]);

    const addresses = areasList.map(a => a.name);
    const activeBranches = branchesList.filter(b => b.isActive).map(b => b.name);

    const filteredItems = orderType === 'DELIVERY'
        ? addresses.filter(addr => addr.toLowerCase().includes(searchTerm.toLowerCase()))
        : activeBranches.filter(branch => branch.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = () => {
        if (searchTerm) {
            onSelect({ type: orderType, selection: searchTerm });
        }
    };

    return (
        <Modal
            show={show}
            centered
            backdrop="static"
            keyboard={false}
            contentClassName="branch-modal-content bg-black border border-secondary border-opacity-25 rounded-4"
        >
            <Modal.Body className="p-4 text-center text-white">
                <h3 className="fw-bold mb-4 mt-2">Please Select Branch</h3>

                {/* Delivery/Pickup Toggle */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="bg-white rounded-pill p-1 d-flex align-items-center" style={{ minWidth: '220px' }}>
                        <button
                            className={`btn btn-sm flex-grow-1 rounded-pill fw-bold border-0 py-2 ${orderType === 'DELIVERY' ? 'bg-white text-dark shadow-sm' : 'bg-transparent text-secondary opacity-50'}`}
                            style={{ fontSize: '11px' }}
                            onClick={() => {
                                setOrderType('DELIVERY');
                                setSearchTerm('');
                                setIsOpen(false);
                            }}
                        >
                            DELIVERY
                        </button>
                        <button
                            className={`btn btn-sm flex-grow-1 rounded-pill fw-bold border-0 py-2 ${orderType === 'PICKUP' ? 'bg-dark text-white shadow-sm' : 'bg-transparent text-secondary opacity-50'}`}
                            style={{ fontSize: '11px' }}
                            onClick={() => {
                                setOrderType('PICKUP');
                                setSearchTerm('');
                                setIsOpen(false);
                            }}
                        >
                            PICKUP
                        </button>
                    </div>
                </div>

                {/* Searchable Input */}
                <div className="position-relative mb-4" ref={dropdownRef}>
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control bg-white text-dark fw-bold py-2 px-3 rounded-2 shadow-sm w-100"
                            style={{ fontSize: '14px', border: 'none', cursor: 'pointer' }}
                            placeholder={orderType === 'DELIVERY' ? "Search for your area..." : "Select a Branch"}
                            value={searchTerm}
                            onFocus={() => setIsOpen(true)}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                maxHeight: '180px',
                                backgroundColor: 'white',
                                zIndex: 1050,
                                position: 'absolute',
                                left: 0,
                                right: 0
                            }}
                        >
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item py-2 px-3 fw-semibold pointer text-dark text-start"
                                        style={{ fontSize: '13px', borderBottom: '1px solid #f8f9fa', cursor: 'pointer' }}
                                        onClick={() => {
                                            setSearchTerm(item);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {item}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-muted italic small">No results found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Select Button */}
                <button
                    className="btn btn-secondary w-100 py-2 fw-bold text-uppercase border-0 shadow-sm rounded-2"
                    style={{ backgroundColor: '#777', fontSize: '14px' }}
                    onClick={handleSelect}
                    disabled={!searchTerm}
                >
                    Select
                </button>
            </Modal.Body>
        </Modal>
    );
};

export default BranchModal;
