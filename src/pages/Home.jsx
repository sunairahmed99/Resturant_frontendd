import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';
import SearchBar from '../components/SearchBar';
import MenuSection from '../components/MenuSection';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import BranchModal from '../components/BranchModal';
import ProductModal from '../components/ProductModal';
import CheckoutModal from '../components/CheckoutModal';
import ChatWidget from '../components/ChatWidget';
import EmptyCartModal from '../components/EmptyCartModal';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchMenuItems } from '../redux/slices/menuSlice';

const Home = () => {
    const dispatch = useDispatch();
    const { items: categories, loading: catLoading } = useSelector(state => state.categories);
    const { items: menuItems, loading: menuLoading } = useSelector(state => state.menu);
    const { items: cartItems } = useSelector(state => state.cart);
    const loading = catLoading || menuLoading;

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showBranchModal, setShowBranchModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);
    const [cartDeliveryInfo, setCartDeliveryInfo] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const savedBranch = localStorage.getItem('selectedBranch');
        if (!savedBranch) setShowBranchModal(true);
    }, []);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchMenuItems());
    }, [dispatch]);

    // Highlight active nav tab on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('[data-category-section]');
            let current = null;
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 120) current = section.getAttribute('data-category-section');
            });
            setActiveCategory(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToCategory = (categoryId) => {
        if (!categoryId) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveCategory(null);
            return;
        }
        const el = document.querySelector(`[data-category-section="${categoryId}"]`);
        if (el) {
            const offset = 80; // navbar height offset
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };
    // Group menu items by their category
    const getItemsByCategory = (categoryId) => {
        let items = menuItems.filter(item => {
            const itemCat = item.category;
            if (!itemCat) return false;
            if (typeof itemCat === 'object') return itemCat._id === categoryId;
            return itemCat === categoryId;
        });

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query))
            );
        }

        return items.map(item => ({
            ...item,
            image: item.image?.url || 'https://placehold.co/600x600?text=Food+Item',
            price: Number(item.price),
            badge: item.badge || null,
        }));
    };



    const handleShowCart = () => {
        if (cartItems.length === 0) {
            setShowEmptyCartModal(true);
        } else {
            setIsCartOpen(true);
        }
    };
    const handleCloseCart = () => setIsCartOpen(false);
    const handleCheckout = (deliveryInfo) => { setCartDeliveryInfo(deliveryInfo || {}); setIsCartOpen(false); setIsCheckoutModalOpen(true); };
    const handleBranchSelect = (data) => {
        localStorage.setItem('selectedBranch', JSON.stringify(data));
        setShowBranchModal(false);
    };
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const defaultCategoryBanners = {
        "CHEF'S SPECIAL": "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9de?auto=format&fit=crop&w=1200&q=80",
        "APPETIZERS": "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=1200&q=80",
        "TIKKA": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
        "BBQ BOTI": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80",
        "KEBAB": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=1200&q=80",
        "KARAHI": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
        "HANDI": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
        "CHINESE": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80",
        "RICE": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        "PLATTERS": "https://images.unsplash.com/photo-1544025162-8356fd105161?auto=format&fit=crop&w=1200&q=80",
        "SIDES": "https://images.unsplash.com/photo-1626082895617-2c6b4458f4fb?auto=format&fit=crop&w=1200&q=80",
        "BEVERAGES": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
        "MOCKTAILS BAR": "https://images.unsplash.com/photo-1536935338788-f0dd5469caec?auto=format&fit=crop&w=1200&q=80",
        "SPECIAL DRINKS": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80"
    };

    return (
        <div className="home-page bg-pattern min-vh-100">
            <Navbar onShowCart={handleShowCart} />
            <Hero />
            <CategoryNav
                categories={categories}
                activeCategory={activeCategory}
                onSelect={scrollToCategory}
            />
            <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                categories.map(cat => {
                    const items = getItemsByCategory(cat._id);
                    if (items.length === 0) return null;
                    const fallbackImg = defaultCategoryBanners[cat.name.toUpperCase()] || "https://images.unsplash.com/photo-1414235077428-33898aba70d5?auto=format&fit=crop&w=1200&q=80";
                    return (
                        <MenuSection
                            key={cat._id}
                            sectionId={cat._id}
                            title={cat.name}
                            items={items}
                            bannerImage={cat.image?.url || fallbackImg}
                            onItemClick={handleProductClick}
                        />
                    );
                })
            )}

            {!loading && categories.length > 0 && searchQuery.trim() && categories.every(cat => getItemsByCategory(cat._id).length === 0) && (
                <div className="text-center py-5 text-white">
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                    <h4 className="fw-bold">No items found</h4>
                    <p className="text-muted">Try adjusting your search query, or browse our menu categories.</p>
                </div>
            )}

            <Footer onShowCart={handleShowCart} />

            <CartDrawer show={isCartOpen} onHide={handleCloseCart} onCheckout={handleCheckout} allProducts={menuItems} />
            <BranchModal show={showBranchModal} onSelect={handleBranchSelect} />
            <ProductModal
                show={isProductModalOpen}
                onHide={() => setIsProductModalOpen(false)}
                product={selectedProduct}
            />
            <CheckoutModal
                show={isCheckoutModalOpen}
                onHide={() => setIsCheckoutModalOpen(false)}
                deliveryInfo={cartDeliveryInfo}
            />
            <ChatWidget />
            <EmptyCartModal show={showEmptyCartModal} onHide={() => setShowEmptyCartModal(false)} />
        </div>
    );
};

export default Home;
