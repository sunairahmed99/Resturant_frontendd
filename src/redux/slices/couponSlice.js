import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL as BASE_URL } from '../../apiurl';

const API_URL = `${BASE_URL}/api/coupons`;

export const fetchCoupons = createAsyncThunk('coupons/fetchCoupons', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createCoupon = createAsyncThunk('coupons/createCoupon', async (couponData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/create`, couponData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const validateCoupon = createAsyncThunk('coupons/validateCoupon', async ({ code, orderAmount }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/validate`, { code, orderAmount });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteCoupon = createAsyncThunk('coupons/deleteCoupon', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const couponSlice = createSlice({
    name: 'coupons',
    initialState: {
        items: [],
        appliedCoupon: null,
        loading: false,
        error: null,
        validateLoading: false,
        validateError: null
    },
    reducers: {
        removeCoupon: (state) => {
            state.appliedCoupon = null;
            state.validateError = null;
        },
        clearCouponErrors: (state) => {
            state.error = null;
            state.validateError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCoupons.pending, (state) => { state.loading = true; })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            // Create
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // Validate
            .addCase(validateCoupon.pending, (state) => {
                state.validateLoading = true;
                state.validateError = null;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.validateLoading = false;
                state.appliedCoupon = action.payload;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.validateLoading = false;
                state.validateError = action.payload?.message || 'Invalid coupon';
                state.appliedCoupon = null;
            })
            // Delete
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    }
});

export const { removeCoupon, clearCouponErrors } = couponSlice.actions;
export default couponSlice.reducer;
