import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches, createBranch, updateBranch, deleteBranch } from '../../redux/slices/branchSlice';
import { ImageUploadField } from './MenuManagement';

const BranchManagement = () => {
    const dispatch = useDispatch();
    const { items: branches, loading } = useSelector(state => state.branches);
    const [showModal, setShowModal] = useState(false);
    const [editBranch, setEditBranch] = useState(null);
    const [form, setForm] = useState({
        name: '', address: '', phone: '', manager: '', tables: 20, openTime: '12:00 PM', closeTime: '1:00 AM', image: null, imagePreview: null
    });

    useEffect(() => {
        dispatch(fetchBranches());
    }, [dispatch]);

    const toggleStatus = async (id, currentStatus) => {
        try {
            await dispatch(updateBranch({ id, data: { isActive: !currentStatus } })).unwrap();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const openEdit = (b) => {
        setEditBranch(b);
        setForm({
            name: b.name,
            address: b.address,
            phone: b.phone,
            manager: b.manager || '',
            tables: b.tables || 0,
            openTime: b.openTime || '12:00 PM',
            closeTime: b.closeTime || '1:00 AM',
            image: b.image?.url || null,
            imagePreview: b.image?.url || null
        });
        setShowModal(true);
    };

    const handleImageChange = ({ file, preview }) => {
        setForm(f => ({ ...f, image: file, imagePreview: preview }));
    };

    const handleSave = async () => {
        if (!form.name || !form.address || !form.phone) return;

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (key === 'image') {
                if (form.image instanceof File) {
                    formData.append('image', form.image);
                }
            } else if (key !== 'imagePreview') {
                formData.append(key, form[key]);
            }
        });

        try {
            if (editBranch) {
                await dispatch(updateBranch({ id: editBranch._id, data: formData })).unwrap();
            } else {
                await dispatch(createBranch(formData)).unwrap();
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving branch:', error);
            alert('Failed to save branch');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            try {
                await dispatch(deleteBranch(id)).unwrap();
            } catch (error) {
                console.error('Error deleting branch:', error);
                alert('Failed to delete branch');
            }
        }
    };

    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">Branch Management</div>
                    <div className="section-subtitle">
                        {loading ? 'Loading...' : `${branches.length} branches registered`}
                    </div>
                </div>
                <button className="btn-admin btn-primary-admin" onClick={() => {
                    setEditBranch(null);
                    setForm({ name: '', address: '', phone: '', manager: '', tables: 20, openTime: '12:00 PM', closeTime: '1:00 AM', image: null, imagePreview: null });
                    setShowModal(true);
                }}>
                    ＋ Add Branch
                </button>
            </div>

            {/* Branch Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
                {branches.map(b => (
                    <div className="admin-card" key={b._id} style={{ borderLeft: `3px solid ${b.isActive ? 'var(--admin-success)' : 'var(--admin-danger)'}` }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                            <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: 'var(--admin-bg-alt)', flexShrink: 0 }}>
                                {b.image?.url ? (
                                    <img src={b.image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏪</div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{b.name}</div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" className="toggle-input" checked={b.isActive} onChange={() => toggleStatus(b._id, b.isActive)} />
                                        <div className="toggle-track" />
                                    </label>
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>📍 {b.address}</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 16 }}>
                            {[
                                { label: 'Manager', value: b.manager || 'N/A', icon: '👤' },
                                { label: 'Phone', value: b.phone, icon: '📞' },
                                { label: 'Tables', value: b.tables, icon: '🪑' },
                                { label: 'Hours', value: `${b.openTime} – ${b.closeTime}`, icon: '🕐' },
                            ].map(f => (
                                <div key={f.label}>
                                    <div style={{ fontSize: 11, color: 'var(--admin-text-dim)', marginBottom: 2 }}>{f.icon} {f.label}</div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{f.value}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--admin-border)' }}>
                            <span className={`badge-status ${b.isActive ? 'badge-success' : 'badge-danger'}`}>
                                {b.isActive ? 'Open' : 'Closed'}
                            </span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn-admin btn-ghost btn-sm" onClick={() => openEdit(b)}>✏️ Edit</button>
                                <button className="btn-admin btn-icon btn-sm" onClick={() => handleDelete(b._id)} style={{ color: 'var(--admin-danger)' }}>🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">{editBranch ? 'Edit Branch' : 'Add New Branch'}</div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <ImageUploadField
                                label="Branch Image"
                                preview={form.imagePreview}
                                onChange={handleImageChange}
                            />
                            <div><label className="form-label-admin">Branch Name *</label><input className="admin-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                            <div><label className="form-label-admin">Address *</label><input className="admin-input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                            <div className="form-row">
                                <div><label className="form-label-admin">Phone *</label><input className="admin-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                                <div><label className="form-label-admin">Manager</label><input className="admin-input" value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))} /></div>
                            </div>
                            <div className="form-row">
                                <div><label className="form-label-admin">Opening Time</label><input className="admin-input" value={form.openTime} onChange={e => setForm(f => ({ ...f, openTime: e.target.value }))} /></div>
                                <div><label className="form-label-admin">Closing Time</label><input className="admin-input" value={form.closeTime} onChange={e => setForm(f => ({ ...f, closeTime: e.target.value }))} /></div>
                            </div>
                            <div><label className="form-label-admin">No. of Tables</label><input className="admin-input" type="number" value={form.tables} onChange={e => setForm(f => ({ ...f, tables: e.target.value }))} /></div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                                <button className="btn-admin btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-admin btn-primary-admin" onClick={handleSave}>{editBranch ? 'Update' : 'Add Branch'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagement;
