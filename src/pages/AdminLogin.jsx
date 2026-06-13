import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, verifyLogin, clearError } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, otpSent, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin');
        }
        return () => dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    const handleLoginRequest = (e) => {
        e.preventDefault();
        dispatch(loginRequest({ email, password }));
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        dispatch(verifyLogin({ email, otp }));
    };

    const handleOtpChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(val);
    };

    return (
        <div style={styles.page}>
            {/* Animated background */}
            <div style={styles.bgOrb1}></div>
            <div style={styles.bgOrb2}></div>
            <div style={styles.bgOrb3}></div>

            <div style={styles.card}>
                {/* Logo / Icon */}
                <div style={styles.logoWrap}>
                    <div style={styles.logoIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17l10 5 10-5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12l10 5 10-5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 style={styles.brandName}>ZEST & ZEST</h1>
                    <p style={styles.brandSub}>Admin Portal</p>
                </div>

                {/* Divider */}
                <div style={styles.divider}></div>

                {/* Title */}
                <h2 style={styles.title}>
                    {otpSent ? '🔐 Verify Your Identity' : '🔑 Admin Login'}
                </h2>
                <p style={styles.subtitle}>
                    {otpSent
                        ? `We've sent a 6-digit code to ${email}`
                        : 'Enter your credentials to access the dashboard'
                    }
                </p>

                {/* Error Alert */}
                {error && (
                    <div style={styles.alertError}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2" />
                            <line x1="15" y1="9" x2="9" y2="15" stroke="#f87171" strokeWidth="2" />
                            <line x1="9" y1="9" x2="15" y2="15" stroke="#f87171" strokeWidth="2" />
                        </svg>
                        {error}
                    </div>
                )}

                {!otpSent ? (
                    /* ─── Login Form ─── */
                    <form onSubmit={handleLoginRequest} autoComplete="off">
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#9ca3af" strokeWidth="2" />
                                        <polyline points="22,6 12,13 2,6" stroke="#9ca3af" strokeWidth="2" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    placeholder="sunairahmed9908@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="off"
                                    style={styles.input}
                                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#9ca3af" strokeWidth="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9ca3af" strokeWidth="2" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    style={{ ...styles.input, paddingRight: '48px' }}
                                    onFocus={(e) => Object.assign(e.target.style, { ...styles.inputFocus, paddingRight: '48px' })}
                                    onBlur={(e) => Object.assign(e.target.style, { ...styles.input, paddingRight: '48px' })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeBtn}
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="1" y1="1" x2="23" y2="23" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9ca3af" strokeWidth="2" />
                                            <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? { ...styles.btnPrimary, opacity: 0.7, cursor: 'not-allowed' } : styles.btnPrimary}
                            onMouseEnter={(e) => { if (!loading) Object.assign(e.target.style, styles.btnPrimaryHover); }}
                            onMouseLeave={(e) => { if (!loading) Object.assign(e.target.style, styles.btnPrimary); }}
                        >
                            {loading ? (
                                <span style={styles.btnContent}>
                                    <span style={styles.spinner}></span>
                                    Sending OTP to Gmail...
                                </span>
                            ) : (
                                <span style={styles.btnContent}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <polyline points="10,17 15,12 10,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    Send OTP & Continue
                                </span>
                            )}
                        </button>
                    </form>
                ) : (
                    /* ─── OTP Form ─── */
                    <form onSubmit={handleVerifyOtp}>
                        <div style={styles.otpInfoBox}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', flexShrink: 0 }}>
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#f59e0b" strokeWidth="2" />
                                <polyline points="22,6 12,13 2,6" stroke="#f59e0b" strokeWidth="2" />
                            </svg>
                            <div>
                                <p style={{ margin: 0, fontSize: '13px', color: '#fbbf24', fontWeight: '600' }}>OTP Sent Successfully!</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Check your Gmail inbox. Code expires in 10 minutes.</p>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={{ ...styles.label, textAlign: 'center', display: 'block' }}>Enter 6-Digit OTP Code</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="• • • • • •"
                                value={otp}
                                onChange={handleOtpChange}
                                required
                                maxLength={6}
                                style={styles.otpInput}
                                onFocus={(e) => Object.assign(e.target.style, styles.otpInputFocus)}
                                onBlur={(e) => Object.assign(e.target.style, styles.otpInput)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            style={(loading || otp.length !== 6) ? { ...styles.btnSuccess, opacity: 0.7, cursor: 'not-allowed' } : styles.btnSuccess}
                            onMouseEnter={(e) => { if (!loading && otp.length === 6) Object.assign(e.target.style, styles.btnSuccessHover); }}
                            onMouseLeave={(e) => { if (!loading && otp.length === 6) Object.assign(e.target.style, styles.btnSuccess); }}
                        >
                            {loading ? (
                                <span style={styles.btnContent}>
                                    <span style={styles.spinner}></span>
                                    Verifying OTP...
                                </span>
                            ) : (
                                <span style={styles.btnContent}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Verify & Open Admin Panel
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            style={styles.backBtn}
                        >
                            ← Back to Login
                        </button>
                    </form>
                )}

                <p style={styles.secureNote}>
                    🔒 Secure admin access — 2-step verification required
                </p>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -20px) scale(1.1); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20px, 30px) scale(0.9); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, 20px) scale(1.05); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        padding: '20px',
    },
    bgOrb1: {
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
        animation: 'float1 8s ease-in-out infinite',
        pointerEvents: 'none',
    },
    bgOrb2: {
        position: 'absolute',
        bottom: '-150px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        animation: 'float2 10s ease-in-out infinite',
        pointerEvents: 'none',
    },
    bgOrb3: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)',
        animation: 'float3 12s ease-in-out infinite',
        pointerEvents: 'none',
    },
    card: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.1)',
        animation: 'slideUp 0.5s ease-out',
    },
    logoWrap: {
        textAlign: 'center',
        marginBottom: '8px',
    },
    logoIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '16px',
        marginBottom: '12px',
    },
    brandName: {
        color: '#f59e0b',
        fontSize: '20px',
        fontWeight: '800',
        letterSpacing: '3px',
        margin: '0 0 4px 0',
        textShadow: '0 0 20px rgba(245,158,11,0.4)',
    },
    brandSub: {
        color: '#6b7280',
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        margin: 0,
    },
    divider: {
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)',
        margin: '24px 0',
    },
    title: {
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        textAlign: 'center',
    },
    subtitle: {
        color: '#6b7280',
        fontSize: '13px',
        textAlign: 'center',
        margin: '0 0 24px 0',
        lineHeight: '1.5',
    },
    alertError: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '10px',
        padding: '12px 14px',
        marginBottom: '20px',
        color: '#f87171',
        fontSize: '13px',
    },
    inputGroup: {
        marginBottom: '18px',
    },
    label: {
        display: 'block',
        color: '#9ca3af',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: '8px',
    },
    inputWrap: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    input: {
        width: '100%',
        padding: '13px 14px 13px 42px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
    },
    inputFocus: {
        width: '100%',
        padding: '13px 14px 13px 42px',
        background: 'rgba(245,158,11,0.05)',
        border: '1px solid rgba(245,158,11,0.4)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        boxShadow: '0 0 0 3px rgba(245,158,11,0.1)',
    },
    eyeBtn: {
        position: 'absolute',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
    },
    otpInfoBox: {
        display: 'flex',
        alignItems: 'flex-start',
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '20px',
    },
    otpInput: {
        width: '100%',
        padding: '18px',
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: '16px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
    },
    otpInputFocus: {
        width: '100%',
        padding: '18px',
        background: 'rgba(245,158,11,0.05)',
        border: '2px solid rgba(245,158,11,0.5)',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: '16px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        boxShadow: '0 0 0 4px rgba(245,158,11,0.1)',
    },
    btnPrimary: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        border: 'none',
        borderRadius: '10px',
        color: '#1a1a1a',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginTop: '8px',
        boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
    },
    btnPrimaryHover: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        border: 'none',
        borderRadius: '10px',
        color: '#1a1a1a',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginTop: '8px',
        boxShadow: '0 6px 20px rgba(245,158,11,0.5)',
        transform: 'translateY(-1px)',
    },
    btnSuccess: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        border: 'none',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginTop: '8px',
        boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
    },
    btnSuccessHover: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #34d399, #10b981)',
        border: 'none',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginTop: '8px',
        boxShadow: '0 6px 20px rgba(16,185,129,0.5)',
        transform: 'translateY(-1px)',
    },
    backBtn: {
        width: '100%',
        background: 'transparent',
        border: 'none',
        color: '#6b7280',
        fontSize: '13px',
        cursor: 'pointer',
        padding: '12px',
        marginTop: '8px',
        transition: 'color 0.2s',
    },
    btnContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    spinner: {
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid rgba(0,0,0,0.2)',
        borderTopColor: '#1a1a1a',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    secureNote: {
        textAlign: 'center',
        color: '#4b5563',
        fontSize: '11px',
        marginTop: '24px',
        marginBottom: 0,
        letterSpacing: '0.3px',
    },
};

export default AdminLogin;
