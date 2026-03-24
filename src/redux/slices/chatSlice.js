import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../../apiurl';

const BASE = `${API_URL}/api/messages`;

export const fetchChatHistory = createAsyncThunk('chat/fetchHistory', async (roomId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE}/${roomId}`);
        return { roomId, messages: res.data?.messages || [] };
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const fetchActiveRooms = createAsyncThunk('chat/fetchRooms', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE}/rooms/active`);
        return res.data?.rooms || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: { rooms: [], messages: {}, loading: false, error: null },
    reducers: {
        addRoom: (state, action) => {
            if (!state.rooms.includes(action.payload)) {
                state.rooms = [action.payload, ...state.rooms];
            }
        },
        addMessage: (state, action) => {
            const { roomId } = action.payload;
            if (!state.messages[roomId]) state.messages[roomId] = [];
            state.messages[roomId].push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveRooms.fulfilled, (state, action) => {
                // Merge new rooms without duplicating
                action.payload.forEach(r => { if (!state.rooms.includes(r)) state.rooms.push(r); });
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.messages[action.payload.roomId] = action.payload.messages;
            });
    },
});

export const { addRoom, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
