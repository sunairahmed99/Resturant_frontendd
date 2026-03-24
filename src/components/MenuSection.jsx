import React, { useEffect, useRef } from 'react';
import MenuCard from './MenuCard';

const MenuSection = ({ title, items, bannerImage, onItemClick, sectionId }) => {
    const bannerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only trigger once
                }
            });
        }, observerOptions);

        // Observe banner
        if (bannerRef.current) observer.observe(bannerRef.current);

        // Observe each card with staggered delay via CSS custom prop
        cardsRef.current.forEach((card, i) => {
            if (card) {
                card.style.transitionDelay = `${i * 60}ms`;
                observer.observe(card);
            }
        });

        return () => observer.disconnect();
    }, [items]);

    return (
        <section
            className="menu-section py-5 container-fluid px-md-5"
            data-category-section={sectionId}
        >
            {bannerImage && (
                <div
                    ref={bannerRef}
                    className="section-banner reveal-left mb-4 position-relative overflow-hidden rounded-3 bg-dark shadow"
                    style={{ height: '160px' }}
                >
                    <img src={bannerImage} alt={title} className="w-100 h-100 object-fit-cover opacity-50" />
                    <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3">
                        <h1 className="display-4 text-white fw-bold text-uppercase m-0"
                            style={{ letterSpacing: '8px', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                            {title}
                        </h1>
                    </div>
                </div>
            )}

            {!bannerImage && (
                <h2 className="text-white text-uppercase mb-4 border-start border-danger border-4 ps-3 reveal-left"
                    ref={bannerRef}>
                    {title}
                </h2>
            )}

            <div className="row g-2 g-md-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="col-6 col-md-4 col-lg-3 reveal"
                        ref={el => cardsRef.current[index] = el}
                    >
                        <MenuCard {...item} onClick={() => onItemClick && onItemClick(item)} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MenuSection;
