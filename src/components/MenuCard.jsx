import React from 'react';

const MenuCard = ({ name, description, price, image, badge, onClick }) => {
    return (
        <div
            className="menu-card h-100 p-0 position-relative border-0 rounded-3 overflow-hidden pointer"
            onClick={onClick}
        >
            <div className="ratio ratio-1x1 h-100">
                <img
                    src={image || 'https://via.placeholder.com/300?text=Food'}
                    alt={name}
                    className="img-fluid object-fit-cover w-100 h-100"
                />
                {/* Overlays */}
                <div className="position-absolute top-0 start-0 w-100 h-100 p-3 d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)' }}>
                    <div>
                        {badge && (
                            <span className="badge bg-white text-black rounded-pill p-1 px-2 mb-1" style={{ fontSize: '8px', fontWeight: 'bold' }}>{badge}</span>
                        )}
                        <h6 className="fw-bold text-white mb-0" style={{ fontSize: '11px', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{name}</h6>
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                        <span className="small fw-bold text-white bg-black bg-opacity-50 rounded px-2 py-1" style={{ fontSize: '10px' }}>Rs.{price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
