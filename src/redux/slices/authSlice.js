import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL as BASE_URL } from '../../apiurl';

const API_URL = `${BASE_URL}/api/auth`;

export const loginRequest = createAsyncThunk(
    'auth/loginRequest',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            return response.data;
        } catch (error) {
            if (!error.response) {
                return rejectWithValue({ message: 'Server is not reachable. Please ensure the backend is running.' });
            }
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyLogin = createAsyncThunk(
    'auth/verifyLogin',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/verify-login`, data);
            return response.data;
        } catch (error) {
            if (!error.response) {
                return rejectWithValue({ message: 'Server is not reachable. Please ensure the backend is running.' });
            }
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    admin: JSON.parse(localStorage.getItem('admin')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    otpSent: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.admin = null;
            state.token = null;
            state.isAuthenticated = false;
            state.otpSent = false;
            localStorage.removeItem('admin');
            localStorage.removeItem('token');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login Request
            .addCase(loginRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginRequest.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(loginRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login request failed';
            })
            // Verify Login
            .addCase(verifyLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.admin = action.payload.admin;
                state.token = action.payload.token;
                state.otpSent = false;
                localStorage.setItem('admin', JSON.stringify(action.payload.admin));
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(verifyLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Verification failed';
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
