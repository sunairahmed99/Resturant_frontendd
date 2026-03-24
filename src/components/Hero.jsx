import React, { useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../redux/slices/bannerSlice';

const Hero = () => {
    const dispatch = useDispatch();
    const { items: banners, loading } = useSelector(state => state.banners);

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    const activeBanners = banners.filter(b => b.isActive);
    const defaultSlides = [
        {
            image: "https://placehold.co/1200x600?text=Delicious+Food+1",
            title: "MUTTON CHOPS",
        },
        {
            image: "https://placehold.co/1200x600?text=Delicious+Food+2",
            title: "CUISINE WITH CULTURE",
        },
        {
            image: "https://placehold.co/1200x600?text=Delicious+Food+3",
            title: "DELICIOUS APPETIZERS",
        }
    ];

    const displaySlides = banners.length > 0 ? banners.map(b => ({
        image: b.image.url,
        title: b.title
    })) : defaultSlides;

    if (loading && banners.length === 0) return <div style={{ height: '55vh', background: '#000' }} />;

    return (
        <section className="hero-slider position-relative overflow-hidden hero-animate">
            <Carousel
                fade
                indicators={false}
                controls={false}
                interval={5000}
                pause={false}
                slide={true}
                ride="carousel"
            >
                {displaySlides.map((slide, index) => (
                    <Carousel.Item key={index} style={{ height: '55vh', width: '100%', overflow: 'hidden' }}>
                        <img
                            src={slide.image}
                            alt={slide.title || "Banner"}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="d-block opacity-75"
                        />
                        {slide.title && (
                            <div className="carousel-caption d-none d-md-block" style={{ bottom: '20%' }}>
                                <h1 className="display-4 fw-bold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>{slide.title}</h1>
                            </div>
                        )}
                    </Carousel.Item>
                ))}
            </Carousel>
        </section>
    );
};

export default Hero;
