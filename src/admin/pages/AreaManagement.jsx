import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas, createArea, updateArea, deleteArea } from '../../redux/slices/areaSlice';

import { API_URL } from '../../apiurl';
const API_BASE_URL = `${API_URL}/api`;

const AreaManagement = () => {
    const dispatch = useDispatch();
    const { items: areas, loading } = useSelector(state => state.areas);
    const [showModal, setShowModal] = useState(false);
    const [editArea, setEditArea] = useState(null);
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchAreas());
    }, [dispatch]);

    const filtered = areas.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

    const handleSave = async () => {
        if (!name.trim()) return;
        try {
            if (editArea) {
                await dispatch(updateArea({ id: editArea._id, data: { name } })).unwrap();
            } else {
                await dispatch(createArea({ name })).unwrap();
            }
            setName('');
            setEditArea(null);
            setShowModal(false);
        } catch (error) {
            console.error('Error saving area:', error);
            alert('Failed to save area');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this area?')) {
            try {
                await dispatch(deleteArea(id)).unwrap();
            } catch (error) {
                console.error('Error deleting area:', error);
                alert('Failed to delete area');
            }
        }
    };

    const openEdit = (area) => {
        setEditArea(area);
        setName(area.name);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditArea(null);
        setName('');
        setShowModal(true);
    };

    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">Area Management</div>
                    <div className="section-subtitle">
                        {loading ? 'Loading...' : `${areas.length} locations active`}
                    </div>
                </div>
                <button className="btn-admin btn-primary-admin" onClick={openAdd}>
                    <span>＋</span> Add New Area
                </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div className="input-group-admin" style={{ maxWidth: 350 }}>
                    <span className="input-icon">🔍</span>
                    <input className="admin-input" placeholder="Search areas..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>#</th>
                                <th>Area Name</th>
                                <th>Created At</th>
                                <th style={{ width: 120 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((area, idx) => (
                                <tr key={area._id}>
                                    <td style={{ color: 'var(--admin-text-muted)' }}>{String(idx + 1).padStart(2, '0')}</td>
                                    <td style={{ fontWeight: 600 }}>{area.name}</td>
                                    <td style={{ color: 'var(--admin-text-dim)', fontSize: 13 }}>{new Date(area.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn-admin btn-ghost btn-icon btn-sm" onClick={() => openEdit(area)} title="Edit">✏️</button>
                                            <button className="btn-admin btn-icon btn-sm" onClick={() => handleDelete(area._id)} title="Delete" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && !loading && (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--admin-text-muted)' }}>No areas found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">{editArea ? 'Edit Area' : 'Add New Area'}</div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label className="form-label-admin">Area Name *</label>
                                <input className="admin-input" placeholder="e.g. Clifton, Karachi" value={name} onChange={e => setName(e.target.value)} autoFocus />
                            </div>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                                <button className="btn-admin btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-admin btn-primary-admin" onClick={handleSave}>
                                    {editArea ? 'Update Area' : 'Save Area'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AreaManagement;
