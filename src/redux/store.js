import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import menuReducer from './slices/menuSlice';
import bannerReducer from './slices/bannerSlice';
import branchReducer from './slices/branchSlice';
import orderReducer from './slices/orderSlice';
import settingsReducer from './slices/settingsSlice';
import customerReducer from './slices/customerSlice';
import dashboardReducer from './slices/dashboardSlice';
import chatReducer from './slices/chatSlice';
import areaReducer from './slices/areaSlice';
import analyticsReducer from './slices/analyticsSlice';
import bookingReducer from './slices/bookingSlice';
import couponReducer from './slices/couponSlice';
import myOrdersReducer from './slices/myOrdersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    categories: categoryReducer,
    menu: menuReducer,
    banners: bannerReducer,
    branches: branchReducer,
    orders: orderReducer,
    settings: settingsReducer,
    customers: customerReducer,
    dashboard: dashboardReducer,
    chat: chatReducer,
    areas: areaReducer,
    analytics: analyticsReducer,
    bookings: bookingReducer,
    coupons: couponReducer,
    myOrders: myOrdersReducer,
  },
});

export default store;
