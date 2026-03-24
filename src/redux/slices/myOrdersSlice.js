import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/orders`;

export const fetchMyOrders = createAsyncThunk('myOrders/fetch', async (phone, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE}/by-phone/${encodeURIComponent(phone)}`);
        return res.data?.orders || [];
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

const myOrdersSlice = createSlice({
    name: 'myOrders',
    initialState: {
        orders: [],
        loading: false,
        error: null,
        searched: false
    },
    reducers: {
        clearMyOrders: (state) => {
            state.orders = [];
            state.searched = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (state) => { 
                state.loading = true; 
                state.error = null; 
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.searched = true;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.searched = true;
            });
    }
});

export const { clearMyOrders } = myOrdersSlice.actions;
export default myOrdersSlice.reducer;
