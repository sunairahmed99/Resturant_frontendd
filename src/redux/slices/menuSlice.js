import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api`;

export const fetchMenuItems = createAsyncThunk('menu/fetchAll', async (categoryId, { rejectWithValue }) => {
    try {
        const url = categoryId ? `${BASE}/menu-items?category=${categoryId}` : `${BASE}/menu-items`;
        const res = await axios.get(url);
        return res.data?.data || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const createMenuItem = createAsyncThunk('menu/create', async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${BASE}/menu-items`, formData);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateMenuItem = createAsyncThunk('menu/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BASE}/menu-items/${id}`, data);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteMenuItem = createAsyncThunk('menu/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE}/menu-items/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const menuSlice = createSlice({
    name: 'menu',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchMenuItems.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchMenuItems.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createMenuItem.fulfilled, (state, action) => { if (action.payload) state.items.unshift(action.payload); })
            .addCase(updateMenuItem.fulfilled, (state, action) => {
                if (action.payload) state.items = state.items.map(i => i._id === action.payload._id ? action.payload : i);
            })
            .addCase(deleteMenuItem.fulfilled, (state, action) => { state.items = state.items.filter(i => i._id !== action.payload); });
    },
});

export default menuSlice.reducer;
