import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/customers`;

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(BASE);
        return res.data?.data || res.data?.customers || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const customerSlice = createSlice({
    name: 'customers',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCustomers.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchCustomers.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export default customerSlice.reducer;
