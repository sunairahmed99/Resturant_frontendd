import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, verifyLogin, clearError } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

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

    return (
        <div className="bg-pattern min-vh-100 d-flex flex-column">
            <Navbar />
            <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <Card
                    className="menu-card"
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '30px',
                        border: '1px solid var(--secondary-color)',
                        background: 'rgba(26, 18, 17, 0.95)'
                    }}
                >
                    <h2 className="text-center mb-4 text-white font-heading">
                        {otpSent ? 'Verify OTP' : 'Admin Login'}
                    </h2>

                    {error && <Alert variant="danger" style={{ background: 'rgba(192, 34, 33, 0.2)', border: '1px solid var(--primary-color)', color: 'white' }}>{error}</Alert>}

                    {!otpSent ? (
                        <Form onSubmit={handleLoginRequest} autoComplete="off">
                            <Form.Group className="mb-3">
                                <Form.Label className="text-white small text-uppercase fw-bold">Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="off"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-white small text-uppercase fw-bold">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 py-2 fw-bold text-uppercase"
                                disabled={loading}
                                style={{ background: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                            >
                                {loading ? 'Sending OTP...' : 'Login'}
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleVerifyOtp}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-white small text-uppercase fw-bold text-center w-100">Enter 6-Digit OTP</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="text-center fs-4 fw-bold"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', letterSpacing: '5px' }}
                                />
                                <Form.Text className="text-white text-center d-block mt-2 small">
                                    Check your email for the verification code.
                                </Form.Text>
                            </Form.Group>
                            <Button
                                variant="success"
                                type="submit"
                                className="w-100 py-2 fw-bold text-uppercase"
                                disabled={loading}
                                style={{ background: 'var(--secondary-color)', borderColor: 'var(--secondary-color)', color: 'black' }}
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </Button>
                            <button
                                className="btn btn-link w-100 mt-3 text-white text-decoration-none small"
                                onClick={() => window.location.reload()}
                                type="button"
                            >
                                ← Back to Login
                            </button>
                        </Form>
                    )}
                </Card>
            </Container>
            <Footer />
        </div>
    );
};

export default Login;
