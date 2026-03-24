import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/banners`;

export const fetchBanners = createAsyncThunk('banners/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(BASE);
        return res.data?.data || res.data?.banners || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const createBanner = createAsyncThunk('banners/create', async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.post(BASE, formData);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateBanner = createAsyncThunk('banners/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BASE}/${id}`, data);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteBanner = createAsyncThunk('banners/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const bannerSlice = createSlice({
    name: 'banners',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchBanners.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchBanners.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createBanner.fulfilled, (state, action) => { if (action.payload) state.items.unshift(action.payload); })
            .addCase(updateBanner.fulfilled, (state, action) => {
                if (action.payload) state.items = state.items.map(i => i._id === action.payload._id ? action.payload : i);
            })
            .addCase(deleteBanner.fulfilled, (state, action) => { state.items = state.items.filter(i => i._id !== action.payload); });
    },
});

export default bannerSlice.reducer;
