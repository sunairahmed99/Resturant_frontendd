import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/dashboard`;

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE}/stats`);
        return res.data?.stats || res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: { stats: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
            .addCase(fetchDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export default dashboardSlice.reducer;
