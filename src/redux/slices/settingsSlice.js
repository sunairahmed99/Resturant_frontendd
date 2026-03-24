import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api`;

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE}/settings`);
        return res.data?.settings || res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateSettings = createAsyncThunk('settings/update', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BASE}/settings`, data);
        return res.data?.settings || res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const settingsSlice = createSlice({
    name: 'settings',
    initialState: { data: null, loading: false, error: null, saved: false },
    reducers: { clearSaved: (state) => { state.saved = false; } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSettings.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(updateSettings.pending, (state) => { state.loading = true; state.saved = false; })
            .addCase(updateSettings.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; state.saved = true; })
            .addCase(updateSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { clearSaved } = settingsSlice.actions;
export default settingsSlice.reducer;
