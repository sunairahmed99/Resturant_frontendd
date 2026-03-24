import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/branches`;

export const fetchBranches = createAsyncThunk('branches/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(BASE);
        return res.data?.data || res.data?.branches || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const createBranch = createAsyncThunk('branches/create', async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.post(BASE, formData);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateBranch = createAsyncThunk('branches/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BASE}/${id}`, data);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteBranch = createAsyncThunk('branches/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const branchSlice = createSlice({
    name: 'branches',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranches.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchBranches.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchBranches.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createBranch.fulfilled, (state, action) => { if (action.payload) state.items.unshift(action.payload); })
            .addCase(updateBranch.fulfilled, (state, action) => {
                if (action.payload) state.items = state.items.map(i => i._id === action.payload._id ? action.payload : i);
            })
            .addCase(deleteBranch.fulfilled, (state, action) => { state.items = state.items.filter(i => i._id !== action.payload); });
    },
});

export default branchSlice.reducer;
