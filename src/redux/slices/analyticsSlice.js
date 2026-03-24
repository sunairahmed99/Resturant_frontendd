import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/analytics`;

export const fetchAnalytics = createAsyncThunk('analytics/fetchStats', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE}/stats`);
        return res.data?.stats || res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalytics.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default analyticsSlice.reducer;
