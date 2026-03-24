import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createBooking, resetSubmitStatus } from '../redux/slices/bookingSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BallroomBooking = () => {
    const dispatch = useDispatch();
    const { loading, submitStatus, error } = useSelector(state => state.bookings);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: 'Birthday',
        numberOfPeople: '',
        eventDate: '',
        timeSlot: 'Evening (4 PM – 8 PM)',
        additionalRequests: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (submitStatus === 'success') {
            setShowSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                eventType: 'Birthday',
                numberOfPeople: '',
                eventDate: '',
                timeSlot: 'Evening (4 PM – 8 PM)',
                additionalRequests: ''
            });
            setTimeout(() => {
                setShowSuccess(false);
                dispatch(resetSubmitStatus());
            }, 5000);
        }
    }, [submitStatus, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createBooking(formData));
    };

    const eventTypes = ['Birthday', 'Anniversary', 'Corporate', 'Wedding', 'Farewell', 'Nikah', 'Mehndi', 'Movie Night', 'Game Night', 'Other'];
    const timeSlots = ['Afternoon (12 PM – 4 PM)', 'Evening (4 PM – 8 PM)', 'Night (8 PM – 12 AM)', 'Full Day'];

    return (
        <div className="bg-pattern min-vh-100">
            <Navbar />

            <div className="container py-5 mt-4">
                {/* Back Button */}
                <Link to="/" className="btn btn-outline-light btn-sm mb-4 rounded-pill px-3">
                    <i className="bi bi-arrow-left me-2"></i> Back to Home
                </Link>

                {/* Venue Gallery/Hero */}
                <div className="row mb-5 g-4 hero-animate">
                    <div className="col-lg-8">
                        <div className="rounded-4 overflow-hidden shadow-lg position-relative" style={{ height: '500px' }}>
                            <img
                                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
                                alt="Main Venue"
                                className="w-100 h-100 object-fit-cover"
                            />
                            <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-dark">
                                <h2 className="text-white fw-bold mb-0">Grand Ballroom Entrance</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 d-flex flex-column gap-4">
                        <div className="rounded-4 overflow-hidden shadow h-50">
                            <img
                                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80"
                                alt="Venue Detail"
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>
                        <div className="rounded-4 overflow-hidden shadow h-50">
                            <img
                                src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=600&q=80"
                                alt="Venue Setup"
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="row g-4 align-items-stretch">
                    <div className="col-lg-6 reveal-left visible">
                        <div className="p-4 bg-dark bg-opacity-50 rounded-4 border border-secondary border-opacity-25 h-100">
                            <h2 className="h4 fw-bold text-danger mb-3 font-heading">Host Your Dream Event at Zest & Zest's Event Space</h2>
                            <p className="text-light opacity-75 mb-3 leading-relaxed small">
                                Host Your Dream Event at Zest & Zest's Event Space By popular demand, Zest & Zest now offers an exclusive, private event space—perfect for birthdays, farewells, anniversaries, corporate gatherings, Nikkah, Mehndi, Mayun, Aqiqah, game nights, movie nights, and more. Celebrate your special moments in a premium, beautifully designed setting tailored just for you. Exceptional service and unforgettable memories await at Zest & Zest's Event Space.
                            </p>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                <div className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 py-1 px-3 rounded-pill tiny-text">Premium Catering</div>
                                <div className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 py-1 px-3 rounded-pill tiny-text">Private Parking</div>
                                <div className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 py-1 px-3 rounded-pill tiny-text">AC Hall</div>
                                <div className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 py-1 px-3 rounded-pill tiny-text">Dedicated Staff</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="p-4 bg-black rounded-4 shadow-xl border border-secondary border-opacity-10 reveal visible">
                            <div className="mb-3">
                                <h3 className="h5 fw-bold text-white mb-1">Reservation Details</h3>
                                <p className="text-muted tiny-text mb-0">Fill out the form below to book your event</p>
                            </div>

                            {showSuccess && (
                                <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success mb-4 rounded-3 d-flex align-items-center">
                                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                                    <div>
                                        <strong>Booking Requested!</strong> Your booking details have been sent. Our team will contact you shortly.
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-4 rounded-3">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {typeof error === 'string' ? error : 'Something went wrong. Please check your details.'}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label text-white tiny-text fw-semibold uppercase tracking-wider mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="form-control form-control-sm bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white py-2 rounded-3"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white tiny-text fw-semibold uppercase tracking-wider mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="form-control form-control-sm bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white py-2 rounded-3"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white tiny-text fw-semibold uppercase tracking-wider mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="form-control form-control-sm bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white py-2 rounded-3"
                                        placeholder="+92 300 1234567"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white tiny-text fw-semibold uppercase tracking-wider mb-1">Event Type</label>
                                    <select
                                        name="eventType"
                                        className="form-select form-select-sm bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white py-2 rounded-3"
                                        value={formData.eventType}
                                        onChange={handleChange}
                                    >
                                        {eventTypes.map(type => <option key={type} value={type} className="bg-dark">{type}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white tiny-text fw-semibold uppercase tracking-wider mb-1">Guests</label>
                                    <input
                                        type="number"
                                        name="numberOfPeople"
                                        required
                                        min="1"
                                        className="form-control form-control-sm bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white py-2 rounded-3"
                                        placeholder="Enter guest count"
                                        value={formData.numberOfPeople}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white tiny-text fw-semibold uppercase tracking-wider mb-1">Event Date</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="form-control form-control-sm bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white py-2 rounded-3"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-white tiny-text fw-semibold uppercase tracking-wider mb-1">Preferred Time Slot</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {timeSlots.map(slot => (
                                            <div key={slot} className="flex-grow-1">
                                                <input
                                                    type="radio"
                                                    className="btn-check"
                                                    name="timeSlot"
                                                    id={slot}
                                                    value={slot}
                                                    checked={formData.timeSlot === slot}
                                                    onChange={handleChange}
                                                />
                                                <label className="btn btn-outline-secondary btn-sm w-100 py-2 border-opacity-25 rounded-3" htmlFor={slot}>
                                                    {slot}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-white tiny-text fw-semibold uppercase tracking-wider mb-1">Additional Requests</label>
                                    <textarea
                                        name="additionalRequests"
                                        className="form-control form-control-sm bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white py-2 rounded-3"
                                        rows="3"
                                        placeholder="Special dietary requirements, seating preferences, decorations, etc."
                                        value={formData.additionalRequests}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                                <div className="col-12 mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-light w-100 py-3 fw-bold rounded-3 shadow-sm hover-up"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Submitting...
                                            </>
                                        ) : 'Submit Booking Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                .bg-gradient-dark {
                    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
                }
                .uppercase { text-transform: uppercase; }
                .tracking-wider { letter-spacing: 0.1em; }
                .leading-relaxed { line-height: 1.6; }
                .tiny-text { font-size: 11px; }
                .hover-up { transition: all 0.3s ease; }
                .hover-up:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important; }
                select.form-select option { background-color: #1a1a1a; color: white; }
                .btn-check:checked + .btn-outline-secondary {
                    background-color: var(--primary-color) !important;
                    border-color: var(--primary-color) !important;
                    color: white !important;
                }
                .form-control::placeholder {
                    color: white !important;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default BallroomBooking;
