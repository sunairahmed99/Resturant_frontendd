import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api`;

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE}/categories`);
        return res.data?.data || res.data?.categories || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const createCategory = createAsyncThunk('categories/create', async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${BASE}/categories`, formData);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BASE}/categories/${id}`, data);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE}/categories/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createCategory.fulfilled, (state, action) => { if (action.payload) state.items.unshift(action.payload); })
            .addCase(updateCategory.fulfilled, (state, action) => {
                if (action.payload) state.items = state.items.map(i => i._id === action.payload._id ? action.payload : i);
            })
            .addCase(deleteCategory.fulfilled, (state, action) => { state.items = state.items.filter(i => i._id !== action.payload); });
    },
});

export default categorySlice.reducer;
