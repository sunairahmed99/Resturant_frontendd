import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api`;

export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${BASE}/bookings`, data);
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const fetchBookings = createAsyncThunk('bookings/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE}/bookings`);
        return res.data?.data || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateBookingStatus = createAsyncThunk('bookings/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BASE}/bookings/${id}`, { status });
        return res.data?.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteBooking = createAsyncThunk('bookings/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE}/bookings/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const bookingSlice = createSlice({
    name: 'bookings',
    initialState: { items: [], loading: false, error: null, submitStatus: null },
    reducers: {
        resetSubmitStatus: (state) => { state.submitStatus = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => { state.loading = true; state.submitStatus = null; })
            .addCase(createBooking.fulfilled, (state) => { state.loading = false; state.submitStatus = 'success'; })
            .addCase(createBooking.rejected, (state, action) => { state.loading = false; state.submitStatus = 'error'; state.error = action.payload; })
            .addCase(fetchBookings.pending, (state) => { state.loading = true; })
            .addCase(fetchBookings.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchBookings.rejected, (state) => { state.loading = false; })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                if (action.payload) state.items = state.items.map(b => b._id === action.payload._id ? action.payload : b);
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.items = state.items.filter(b => b._id !== action.payload);
            });
    }
});

export const { resetSubmitStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
