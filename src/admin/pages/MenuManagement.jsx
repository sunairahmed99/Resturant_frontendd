import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../redux/slices/menuSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';
import imageCompression from 'browser-image-compression';

import { API_URL } from '../../apiurl';
const API_BASE_URL = `${API_URL}/api`;

/* ── Reusable Image Upload Field ── */
export const ImageUploadField = ({ value, preview, onChange }) => {
    const fileRef = useRef(null);

    const handleFile = async (e) => {
        const originalFile = e.target.files[0];
        if (!originalFile) return;

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
            };
            const compressedBlob = await imageCompression(originalFile, options);
            // Convert blob → proper File so multer/FormData sends it with a filename
            const compressedFile = new File([compressedBlob], originalFile.name, { type: compressedBlob.type || originalFile.type });
            const reader = new FileReader();
            reader.onload = (ev) => onChange({ file: compressedFile, preview: ev.target.result });
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error('Error compressing image:', error);
            // fallback to original if compression fails
            const reader = new FileReader();
            reader.onload = (ev) => onChange({ file: originalFile, preview: ev.target.result });
            reader.readAsDataURL(originalFile);
        }
    };

    const handleUrl = (e) => {
        onChange({ file: null, preview: e.target.value, url: e.target.value });
    };

    const clearImage = () => {
        onChange({ file: null, preview: null, url: '' });
        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <div>
            <label className="form-label-admin">Item Image</label>

            {/* Preview box */}
            <div style={{
                width: '100%', height: 150, borderRadius: 'var(--radius-md)',
                border: `2px dashed ${preview ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
                background: 'var(--admin-surface-2)', marginBottom: 10, overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', transition: 'border-color 0.2s',
            }}>
                {preview ? (
                    <>
                        <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={clearImage} />
                        <button
                            onClick={clearImage}
                            style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: 'var(--admin-text-dim)' }}>
                        <div style={{ fontSize: 32, marginBottom: 6 }}>🖼️</div>
                        <div style={{ fontSize: 12 }}>Image preview will appear here</div>
                    </div>
                )}
            </div>

            {/* Upload file button */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <button
                    type="button"
                    className="btn-admin btn-ghost btn-sm"
                    onClick={() => fileRef.current?.click()}
                    style={{ flexShrink: 0 }}
                >
                    📁 Upload File
                </button>
                <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>or paste an image URL below</span>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            </div>

            {/* URL input */}
            <input
                className="admin-input"
                placeholder="https://example.com/image.jpg"
                value={value || ''}
                onChange={handleUrl}
                style={{ fontSize: 12.5 }}
            />
        </div>
    );
};

const MenuManagement = () => {
    const dispatch = useDispatch();
    const { items: menuItems, loading: loadingItems } = useSelector(state => state.menu);
    const { items: categories, loading: loadingCategories } = useSelector(state => state.categories);
    const loading = loadingItems || loadingCategories;

    const [activeTab, setActiveTab] = useState('All');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ name: '', category: '', price: '', discountPercentage: '', description: '', badge: '', image: null, imagePreview: null, serves: '', time: '' });

    useEffect(() => {
        dispatch(fetchMenuItems());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (categories.length > 0 && !form.category) {
            setForm(f => ({ ...f, category: categories[0]._id }));
        }
    }, [categories, form.category]);

    const filtered = menuItems.filter(item => {
        const matchCat = activeTab === 'All' || item.category?._id === activeTab;
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const openAdd = () => {
        setEditItem(null);
        setForm({ name: '', category: categories[0]?._id || '', price: '', discountPercentage: '', description: '', badge: '', image: null, imagePreview: null, serves: '', time: '' });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({
            name: item.name,
            category: item.category?._id || '',
            price: item.price,
            discountPercentage: item.discountPercentage || '',
            description: item.description,
            badge: item.badge || '',
            image: item.image?.url || null,
            imagePreview: item.image?.url || null,
            serves: item.serves || '',
            time: item.time || ''
        });
        setShowModal(true);
    };

    const handleImageChange = ({ file, preview }) => {
        setForm(f => ({ ...f, image: file, imagePreview: preview }));
    };

    const handleSave = async () => {
        if (!form.name || !form.price || !form.category) return;

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (key === 'image') {
                if (form[key] instanceof Blob || form[key] instanceof File) {
                    formData.append('image', form[key]);
                }
            } else if (key !== 'imagePreview') {
                formData.append(key, form[key]);
            }
        });

        try {
            if (editItem) {
                await dispatch(updateMenuItem({ id: editItem._id, data: formData })).unwrap();
            } else {
                await dispatch(createMenuItem(formData)).unwrap();
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Failed to save menu item');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item?')) {
            try {
                await dispatch(deleteMenuItem(id)).unwrap();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete menu item');
            }
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="section-header">
                <div>
                    <div className="section-title">Menu Management</div>
                    <div className="section-subtitle">
                        {loading ? 'Loading...' : `${menuItems.length} items across ${categories.length} categories`}
                    </div>
                </div>
                <button className="btn-admin btn-primary-admin" onClick={openAdd}>
                    <span>＋</span> Add Item
                </button>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="input-group-admin" style={{ flex: '1 1 200px', maxWidth: 300 }}>
                    <span className="input-icon">🔍</span>
                    <input className="admin-input" placeholder="Search menu items..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="scrollable-tabs" style={{ flex: '1 1 auto' }}>
                    <div className="admin-tabs" style={{ display: 'inline-flex', minWidth: 'auto' }}>
                        <button className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>All</button>
                        {categories.map(c => (
                            <button key={c._id} className={`tab-btn ${activeTab === c._id ? 'active' : ''}`} onClick={() => setActiveTab(c._id)}>{c.name}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="menu-grid">
                {filtered.map(item => (
                    <div className="menu-item-card" key={item._id}>
                        {item.image?.url
                            ? <img src={item.image.url} alt={item.name} className="menu-item-img" onError={e => { e.target.style.display = 'none'; }} />
                            : <div className="menu-item-img-placeholder">🍽️</div>
                        }
                        {item.badge && (
                            <span className="badge-status badge-primary" style={{ position: 'absolute', top: 12, left: 12, fontSize: 10 }}>{item.badge}</span>
                        )}
                        <div className="menu-item-body">
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                                <div className="menu-item-name">{item.name}</div>
                                <span className="badge-status badge-gold" style={{ fontSize: 10, flexShrink: 0 }}>{item.category?.name}</span>
                            </div>
                            <div className="menu-item-desc">{item.description}</div>
                            <div className="menu-item-footer">
                                <div className="menu-item-price">
                                    {item.discountPercentage && item.discountPercentage > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <span style={{ textDecoration: 'line-through', color: 'var(--admin-text-muted)', fontSize: 11 }}>Rs {item.price.toLocaleString()}</span>
                                            <span style={{ color: 'var(--admin-primary)' }}>Rs {item.discountPrice?.toLocaleString()}</span>
                                        </div>
                                    ) : (
                                        <span>Rs {item.price.toLocaleString()}</span>
                                    )}
                                </div>
                                <div className="menu-item-actions">
                                    <button className="btn-admin btn-ghost btn-icon btn-sm" onClick={() => openEdit(item)} title="Edit">✏️</button>
                                    <button className="btn-admin btn-icon btn-sm" onClick={() => handleDelete(item._id)} title="Delete" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>🗑️</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && !loading && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--admin-text-muted)' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                        <div>No items found for "{search}"</div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">{editItem ? 'Edit Menu Item' : 'Add New Item'}</div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* Image Upload */}
                            <ImageUploadField
                                preview={form.imagePreview}
                                onChange={handleImageChange}
                            />

                            <div>
                                <label className="form-label-admin">Item Name *</label>
                                <input className="admin-input" placeholder="e.g. Chicken Karahi" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div className="form-row">
                                <div>
                                    <label className="form-label-admin">Category *</label>
                                    <select className="admin-select" style={{ width: '100%' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        {categories.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label-admin">Price (Rs) *</label>
                                        <input className="admin-input" type="number" placeholder="e.g. 1200" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label-admin">Discount (%)</label>
                                        <input className="admin-input" type="number" placeholder="e.g. 10" value={form.discountPercentage} onChange={e => setForm(f => ({ ...f, discountPercentage: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div>
                                    <label className="form-label-admin">Serves</label>
                                    <input className="admin-input" placeholder="e.g. 2-3 People" value={form.serves} onChange={e => setForm(f => ({ ...f, serves: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="form-label-admin">Prep Time</label>
                                    <input className="admin-input" placeholder="e.g. 25 min" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <label className="form-label-admin">Description</label>
                                <textarea className="admin-input" rows={3} placeholder="Item description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
                            </div>
                            <div>
                                <label className="form-label-admin">Badge (optional)</label>
                                <input className="admin-input" placeholder="e.g. New, Best Seller" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                                <button className="btn-admin btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-admin btn-primary-admin" onClick={handleSave}>
                                    {editItem ? 'Update Item' : 'Add Item'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
