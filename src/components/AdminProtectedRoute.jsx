import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

// JWT token ka expiry check karta hai (bina library ke)
const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // exp milliseconds mein compare karo
        return payload.exp * 1000 > Date.now();
    } catch (e) {
        return false;
    }
};

// Admin ke liye alag protected route
// Token exist karna + valid (not expired) hona chahiye
const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const valid = isAuthenticated && isTokenValid(token);

    useEffect(() => {
        if (!valid && isAuthenticated) {
            dispatch(logout());
        }
    }, [valid, isAuthenticated, dispatch]);

    if (!valid) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;

