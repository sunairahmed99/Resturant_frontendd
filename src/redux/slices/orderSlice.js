import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/orders`;

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(BASE);
        return res.data?.data || res.data?.orders || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
    try {
        const res = await axios.post(BASE, orderData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${BASE}/${id}/status`, { status });
        return res.data?.order || res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateOrderBranch = createAsyncThunk('orders/updateBranch', async ({ id, branch }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${BASE}/${id}/branch`, { branch });
        return res.data?.order || res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: { items: [], loading: false, error: null, lastCreated: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createOrder.fulfilled, (state, action) => { state.lastCreated = action.payload; })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                if (action.payload) state.items = state.items.map(o => o._id === action.payload._id ? action.payload : o);
            })
            .addCase(updateOrderBranch.fulfilled, (state, action) => {
                if (action.payload) state.items = state.items.map(o => o._id === action.payload._id ? action.payload : o);
            });
    },
});

export default orderSlice.reducer;
