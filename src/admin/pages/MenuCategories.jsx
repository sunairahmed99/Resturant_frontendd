import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../redux/slices/menuSlice';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../redux/slices/categorySlice';
import { ImageUploadField } from './MenuManagement';

const StarRating = ({ rating = 4.5 }) => (
    <span style={{ color: '#E6B15B', fontSize: 12, fontWeight: 600 }}>
        ★ {rating.toFixed(1)}
    </span>
);

const CategoryPage = ({ category, onBack }) => {
    const dispatch = useDispatch();
    const { items: allItems, loading } = useSelector(state => state.menu);
    const items = allItems.filter(i => (i.category?._id || i.category) === category._id);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ name: '', price: '', description: '', serves: '', time: '', badge: '', image: null, imagePreview: null });
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchMenuItems());
    }, [dispatch]);

    const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

    const openEdit = (item) => {
        setEditItem(item);
        setForm({
            name: item.name,
            price: item.price,
            description: item.description,
            serves: item.serves || '',
            time: item.time || '',
            badge: item.badge || '',
            image: item.image?.url || null,
            imagePreview: item.image?.url || null
        });
        setShowModal(true);
    };

    const openAdd = () => {
        setEditItem(null);
        setForm({ name: '', price: '', description: '', serves: '', time: '', badge: '', image: null, imagePreview: null });
        setShowModal(true);
    };

    const handleImageChange = ({ file, preview }) => {
        setForm(f => ({ ...f, image: file, imagePreview: preview }));
    };

    const handleSave = async () => {
        if (!form.name || !form.price) return;

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (key === 'image') {
                if (form[key] instanceof File) {
                    formData.append('image', form[key]);
                }
            } else if (key !== 'imagePreview') {
                formData.append(key, form[key]);
            }
        });
        formData.append('category', category._id);

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
            {/* Back & Header */}
            <div style={{ marginBottom: 24 }}>
                <button
                    className="btn-admin btn-ghost btn-sm"
                    onClick={onBack}
                    style={{ marginBottom: 16 }}
                >
                    ← Back to Categories
                </button>
                <div className="section-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 'var(--radius-md)',
                            background: `linear-gradient(135deg, ${category.color || '#C02221'}33, ${category.color || '#C02221'}11)`,
                            border: `2px solid ${category.color || '#C02221'}44`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                            boxShadow: `0 0 20px ${category.glow || 'rgba(192,34,33,0.25)'}`,
                        }}>
                            {category.image?.url ? (
                                <img src={category.image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span>🍽️</span>
                            )}
                        </div>
                        <div>
                            <div className="section-title" style={{ color: category.color || '#C02221' }}>{category.name}</div>
                            <div className="section-subtitle">{category.description} &nbsp;·&nbsp; {loading ? '...' : items.length} items</div>
                        </div>
                    </div>
                    <div className="page-actions">
                        <div className="input-group-admin" style={{ width: 220 }}>
                            <span className="input-icon">🔍</span>
                            <input className="admin-input" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn-admin btn-primary-admin" onClick={openAdd}>＋ Add Item</button>
                    </div>
                </div>
            </div>

            {/* Items Table View */}
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Image</th>
                                <th>Item Name</th>
                                <th>Description</th>
                                <th>Serves</th>
                                <th>Prep Time</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Badge</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item, idx) => (
                                <tr key={item._id}>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>{String(idx + 1).padStart(2, '0')}</td>
                                    <td>
                                        <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: `${category.color || '#C02221'}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {item.image?.url ? (
                                                <img src={item.image.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                            ) : (
                                                <span style={{ fontSize: 20 }}>🍽️</span>
                                            )}
                                        </div>
                                    </td>
                                    <td><span style={{ fontWeight: 600 }}>{item.name}</span></td>
                                    <td style={{ maxWidth: 220, color: 'var(--admin-text-muted)', fontSize: 12.5, whiteSpace: 'normal', lineHeight: 1.4 }}>{item.description}</td>
                                    <td style={{ fontSize: 12.5 }}>{item.serves || '—'}</td>
                                    <td style={{ fontSize: 12.5 }}>⏱ {item.time || '—'}</td>
                                    <td style={{ fontWeight: 700, color: 'var(--admin-gold)' }}>Rs {item.price.toLocaleString()}</td>
                                    <td><StarRating rating={item.rating} /></td>
                                    <td>
                                        {item.badge
                                            ? <span className="badge-status badge-primary" style={{ fontSize: 10 }}>{item.badge}</span>
                                            : <span style={{ color: 'var(--admin-text-dim)', fontSize: 12 }}>—</span>
                                        }
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn-admin btn-ghost btn-icon btn-sm" onClick={() => openEdit(item)} title="Edit">✏️</button>
                                            <button className="btn-admin btn-icon btn-sm" title="Delete"
                                                onClick={() => handleDelete(item._id)}
                                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && !loading && (
                                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 60, color: 'var(--admin-text-muted)' }}>
                                    No items found
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">{editItem ? `Edit — ${editItem.name}` : `Add to ${category.name}`}</div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* Image Upload */}
                            <ImageUploadField
                                preview={form.imagePreview}
                                onChange={handleImageChange}
                            />

                            <div>
                                <label className="form-label-admin">Item Name *</label>
                                <input className="admin-input" placeholder="e.g. Chicken Karahi" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label-admin">Description</label>
                                <textarea className="admin-input" rows={3} placeholder="Describe the item..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
                            </div>
                            <div className="form-row">
                                <div>
                                    <label className="form-label-admin">Price (Rs) *</label>
                                    <input className="admin-input" type="number" placeholder="e.g. 850" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="form-label-admin">Serves</label>
                                    <input className="admin-input" placeholder="e.g. 2–3 People" value={form.serves} onChange={e => setForm(f => ({ ...f, serves: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div>
                                    <label className="form-label-admin">Prep Time</label>
                                    <input className="admin-input" placeholder="e.g. 25 min" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="form-label-admin">Badge (optional)</label>
                                    <input className="admin-input" placeholder="e.g. Best Seller" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
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

/* ─── Main Categories Overview ─── */
const MenuCategories = () => {
    const dispatch = useDispatch();
    const { items: categories, loading } = useSelector(state => state.categories);
    const [activeCat, setActiveCat] = useState(null);
    const [showCatModal, setShowCatModal] = useState(false);
    const [editCat, setEditCat] = useState(null);
    const [catForm, setCatForm] = useState({ name: '', description: '', order: 0, image: null, imagePreview: null });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const openAddCat = () => {
        setEditCat(null);
        setCatForm({ name: '', description: '', image: null, imagePreview: null });
        setShowCatModal(true);
    };

    const openEditCat = (cat) => {
        setEditCat(cat);
        setCatForm({
            name: cat.name,
            description: cat.description,
            order: cat.order ?? 0,
            image: cat.image?.url || null,
            imagePreview: cat.image?.url || null
        });
        setShowCatModal(true);
    };

    const handleCatImageChange = ({ file, preview }) => {
        setCatForm(f => ({ ...f, image: file, imagePreview: preview }));
    };

    const handleSaveCat = async () => {
        if (!catForm.name) return;

        const formData = new FormData();
        formData.append('name', catForm.name);
        formData.append('description', catForm.description);
        formData.append('order', catForm.order ?? 0);
        if (catForm.image instanceof File) {
            formData.append('image', catForm.image);
        }

        try {
            if (editCat) {
                await dispatch(updateCategory({ id: editCat._id, data: formData })).unwrap();
            } else {
                await dispatch(createCategory(formData)).unwrap();
            }
            setShowCatModal(false);
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
        }
    };

    const handleDeleteCat = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this category? All items in this category will be affected.')) {
            try {
                await dispatch(deleteCategory(id)).unwrap();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category');
            }
        }
    };

    if (activeCat) {
        return <CategoryPage category={activeCat} onBack={() => setActiveCat(null)} />;
    }

    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">Menu Categories</div>
                    <div className="section-subtitle">
                        {loading ? 'Loading...' : `${categories.length} categories total`}
                    </div>
                </div>
                <button className="btn-admin btn-primary-admin" onClick={openAddCat}>
                    <span>＋</span> Add Category
                </button>
            </div>

            {/* Category Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
                {categories.map((cat, idx) => {
                    const colors = ['#C02221', '#E6B15B', '#3b82f6', '#f97316', '#10b981', '#8b5cf6'];
                    const color = cat.color || colors[idx % colors.length];
                    const glow = cat.glow || `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.25)`;

                    return (
                        <div
                            key={cat._id}
                            className="admin-card"
                            style={{ cursor: 'pointer', borderColor: `${color}33`, borderLeftColor: color, borderLeftWidth: 3, transition: 'all 0.25s ease', position: 'relative' }}
                            onClick={() => setActiveCat({ ...cat, color, glow })}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${glow}`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                            {/* Actions Overlay */}
                            <div className="card-actions-overlay" style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, zIndex: 2 }}>
                                <button className="btn-admin btn-ghost btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); openEditCat(cat); }} title="Edit">✏️</button>
                                <button className="btn-admin btn-icon btn-sm" onClick={(e) => handleDeleteCat(e, cat._id)} title="Delete" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>🗑️</button>
                            </div>

                            {/* Order Badge */}
                            {cat.order !== undefined && cat.order < 99 && (
                                <div style={{
                                    position: 'absolute', top: 12, left: 12,
                                    background: `${color}22`, border: `1px solid ${color}55`,
                                    color: color, borderRadius: 20, padding: '2px 10px',
                                    fontSize: 11, fontWeight: 700, zIndex: 2
                                }}>
                                    #{cat.order}
                                </div>
                            )}

                            {/* Top */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, marginTop: 24 }}>
                                <div style={{
                                    width: 58, height: 58, borderRadius: 'var(--radius-md)',
                                    background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                                    border: `1.5px solid ${color}44`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 28, boxShadow: `0 0 16px ${glow}`,
                                    overflow: 'hidden'
                                }}>
                                    {cat.image?.url ? (
                                        <img src={cat.image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span>🍽️</span>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 17, color: color, marginBottom: 4 }}>{cat.name}</div>
                            <div style={{ fontSize: 12.5, color: 'var(--admin-text-muted)', marginBottom: 18, lineHeight: 1.4, height: '2.8em', overflow: 'hidden' }}>{cat.description}</div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div style={{ background: 'var(--admin-surface-2)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginBottom: 3 }}>Items</div>
                                    <div style={{ fontSize: 13, fontWeight: 700 }}>{cat.items?.length || 0}</div>
                                </div>
                                <div style={{ background: 'var(--admin-surface-2)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginBottom: 3 }}>Rating</div>
                                    <div style={{ fontSize: 13, fontWeight: 700 }}>★ 4.5</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 16, borderTop: '1px solid var(--admin-border)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Click to manage items</span>
                                <button
                                    className="btn-admin btn-sm"
                                    style={{ background: `${color}22`, color: color, border: `1px solid ${color}44`, pointerEvents: 'none' }}
                                >
                                    Manage →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Category Add/Edit Modal */}
            {showCatModal && (
                <div className="modal-overlay" onClick={() => setShowCatModal(false)}>
                    <div className="modal-box" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">{editCat ? 'Edit Category' : 'Add New Category'}</div>
                            <button className="modal-close" onClick={() => setShowCatModal(false)}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <ImageUploadField
                                preview={catForm.imagePreview}
                                onChange={handleCatImageChange}
                            />
                            <div>
                                <label className="form-label-admin">Category Name *</label>
                                <input className="admin-input" placeholder="e.g. Seafood" value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label-admin">Description</label>
                                <textarea className="admin-input" rows={3} placeholder="Describe this category..." value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label-admin">Display Order <span style={{ color: 'var(--admin-text-muted)', fontWeight: 400, fontSize: 11 }}>(lower = first on homepage)</span></label>
                                <input className="admin-input" type="number" min="0" placeholder="e.g. 1" value={catForm.order} onChange={e => setCatForm(f => ({ ...f, order: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                                <button className="btn-admin btn-ghost" onClick={() => setShowCatModal(false)}>Cancel</button>
                                <button className="btn-admin btn-primary-admin" onClick={handleSaveCat}>
                                    {editCat ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuCategories;
