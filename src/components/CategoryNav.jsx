import React, { useRef } from 'react';

const CategoryNav = ({ categories = [], activeCategory, onSelect }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="position-relative bg-black border-top border-bottom border-secondary d-flex align-items-center">
            <div className="p-3 border-end border-secondary" style={{ backgroundColor: '#1A1211' }}>
                <i className="bi bi-filter-left text-white fs-4"></i>
            </div>

            <div className="flex-grow-1 position-relative overflow-hidden">
                <button
                    className="scroll-arrow left-arrow"
                    onClick={() => scroll('left')}
                    aria-label="Scroll Left"
                >
                    <i className="bi bi-chevron-left"></i>
                </button>

                <div className="category-nav" ref={scrollRef}>
                    <div
                        className={`category-item-mobile ${!activeCategory ? 'active' : ''}`}
                        onClick={() => onSelect && onSelect(null)}
                    >
                        All
                    </div>
                    {categories.map((cat) => (
                        <div
                            key={cat._id}
                            className={`category-item-mobile ${activeCategory === cat._id ? 'active' : ''}`}
                            onClick={() => onSelect && onSelect(cat._id)}
                        >
                            {cat.name}
                        </div>
                    ))}
                </div>

                <button
                    className="scroll-arrow right-arrow"
                    onClick={() => scroll('right')}
                    aria-label="Scroll Right"
                >
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};

export default CategoryNav;
