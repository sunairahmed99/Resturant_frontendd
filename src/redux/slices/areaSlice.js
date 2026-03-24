import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/areas`;

export const fetchAreas = createAsyncThunk('areas/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(BASE);
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const createArea = createAsyncThunk('areas/create', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post(BASE, data);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateArea = createAsyncThunk('areas/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BASE}/${id}`, data);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteArea = createAsyncThunk('areas/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const areaSlice = createSlice({
    name: 'areas',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAreas.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createArea.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // Update
            .addCase(updateArea.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteArea.fulfilled, (state, action) => {
                state.items = state.items.filter(i => i._id !== action.payload);
            });
    }
});

export default areaSlice.reducer;
