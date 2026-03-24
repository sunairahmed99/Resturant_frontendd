import React from 'react';
import { Container, Button, Navbar, Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { admin } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Admin Panel</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Navbar.Text className="me-3">
                                Signed in as: <span className="text-white">{admin?.name || 'Admin'}</span>
                            </Navbar.Text>
                            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-5">
                <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold">Welcome to Dashboard</h1>
                        <p className="col-md-8 fs-4">
                            This is your protected admin dashboard. From here you can manage your website content and users.
                        </p>
                        <hr className="my-4" />
                        <div className="d-flex gap-3">
                            <Button variant="primary" size="lg">Manage Products</Button>
                            <Button variant="success" size="lg">View Orders</Button>
                            <Button variant="info" size="lg" className="text-white">Settings</Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default AdminDashboard;
