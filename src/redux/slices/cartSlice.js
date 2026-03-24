import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    totalAmount: JSON.parse(localStorage.getItem('cartTotal')) || 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(
                (item) => item.id === newItem.id && item.instructions === newItem.instructions
            );

            if (!existingItem) {
                state.items.push({
                    ...newItem,
                    quantity: newItem.quantity || 1,
                    totalPrice: newItem.price * (newItem.quantity || 1),
                });
            } else {
                existingItem.quantity += newItem.quantity || 1;
                existingItem.totalPrice = existingItem.quantity * existingItem.price;
            }

            state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
            localStorage.setItem('cartTotal', JSON.stringify(state.totalAmount));
        },

        updateQuantity(state, action) {
            const { id, instructions, type } = action.payload;
            const item = state.items.find((i) => i.id === id && i.instructions === instructions);

            if (item) {
                if (type === 'increment') {
                    item.quantity++;
                } else if (type === 'decrement' && item.quantity > 1) {
                    item.quantity--;
                }
                item.totalPrice = item.quantity * item.price;
            }

            state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
            localStorage.setItem('cartTotal', JSON.stringify(state.totalAmount));
        },

        removeItem(state, action) {
            const { id, instructions } = action.payload;
            state.items = state.items.filter(
                (item) => !(item.id === id && item.instructions === instructions)
            );
            state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
            localStorage.setItem('cartTotal', JSON.stringify(state.totalAmount));
        },

        clearCart(state) {
            state.items = [];
            state.totalAmount = 0;
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartTotal');
        },
    },
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
