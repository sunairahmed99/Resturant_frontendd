import React from 'react';

const SearchBar = ({ searchQuery, onSearch }) => {
    return (
        <div className="container py-4">
            <div className="input-group rounded-pill overflow-hidden border border-secondary" style={{ backgroundColor: 'white' }}>
                <input
                    type="text"
                    className="form-control border-0 px-4 py-2"
                    placeholder="Search menu items..."
                    style={{ boxShadow: 'none', color: '#333' }}
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <button className="btn btn-dark px-3 m-1 rounded-circle" type="button">
                    <i className="bi bi-search"></i>
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
