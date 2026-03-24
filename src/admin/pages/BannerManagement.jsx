import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '../../redux/slices/bannerSlice';
import { ImageUploadField } from './MenuManagement';

const BannerManagement = () => {
    const dispatch = useDispatch();
    const { items: banners, loading } = useSelector(state => state.banners);
    const [showModal, setShowModal] = useState(false);
    const [editBanner, setEditBanner] = useState(null);
    const [form, setForm] = useState({
        title: '', image: null, imagePreview: null, isActive: true
    });

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    const toggleStatus = async (id, currentStatus) => {
        try {
            await dispatch(updateBanner({ id, data: { isActive: !currentStatus } })).unwrap();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const openEdit = (b) => {
        setEditBanner(b);
        setForm({
            title: b.title || '',
            image: b.image?.url || null,
            imagePreview: b.image?.url || null,
            isActive: b.isActive
        });
        setShowModal(true);
    };

    const handleImageChange = ({ file, preview }) => {
        setForm(f => ({ ...f, image: file, imagePreview: preview }));
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('isActive', form.isActive);

        if (form.image instanceof Blob || form.image instanceof File) {
            // Include Blob because browser-image-compression can return a Blob
            formData.append('image', form.image);
        } else if (!editBanner && !form.image) {
            alert('Please select an image');
            return;
        }

        try {
            if (editBanner) {
                await dispatch(updateBanner({ id: editBanner._id, data: formData })).unwrap();
            } else {
                await dispatch(createBanner(formData)).unwrap();
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving banner:', error);
            alert('Failed to save banner');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this banner?')) {
            try {
                await dispatch(deleteBanner(id)).unwrap();
            } catch (error) {
                console.error('Error deleting banner:', error);
                alert('Failed to delete banner');
            }
        }
    };

    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">Home Banner Management</div>
                    <div className="section-subtitle">
                        {loading ? 'Loading...' : `${banners.length} banners total`}
                    </div>
                </div>
                <button className="btn-admin btn-primary-admin" onClick={() => {
                    setEditBanner(null);
                    setForm({ title: '', image: null, imagePreview: null, isActive: true });
                    setShowModal(true);
                }}>
                    <span>＋</span> Add New Banner
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
                {banners.map(b => (
                    <div className="admin-card" key={b._id} style={{ padding: 0, overflow: 'hidden', borderLeft: `4px solid ${b.isActive ? 'var(--admin-success)' : 'var(--admin-danger)'}` }}>
                        <div style={{ height: 180, position: 'relative', background: '#000' }}>
                            <img src={b.image?.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: b.isActive ? 1 : 0.5 }} />
                            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                                <button className="btn-admin btn-ghost btn-icon btn-sm" onClick={() => openEdit(b)} title="Edit">✏️</button>
                                <button className="btn-admin btn-icon btn-sm" onClick={() => handleDelete(b._id)} title="Delete" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>🗑️</button>
                            </div>
                            {!b.isActive && (
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: 20, color: '#fff', fontSize: 12, fontWeight: 600 }}>INACTIVE</div>
                            )}
                        </div>
                        <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>{b.title || 'Untitled Banner'}</div>
                                <div style={{ fontSize: 12, color: 'var(--admin-text-dim)' }}>Added on {new Date(b.createdAt).toLocaleDateString()}</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" className="toggle-input" checked={b.isActive} onChange={() => toggleStatus(b._id, b.isActive)} />
                                <div className="toggle-track" />
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">{editBanner ? 'Edit Banner' : 'Add New Banner'}</div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <ImageUploadField
                                label="Banner Image (Recommended: 1200x600)"
                                preview={form.imagePreview}
                                onChange={handleImageChange}
                            />
                            <div>
                                <label className="form-label-admin">Banner Title (Optional)</label>
                                <input className="admin-input" placeholder="e.g. Delicious Mutton Chops" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                                <button className="btn-admin btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-admin btn-primary-admin" onClick={handleSave}>
                                    {editBanner ? 'Update Banner' : 'Save Banner'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManagement;
