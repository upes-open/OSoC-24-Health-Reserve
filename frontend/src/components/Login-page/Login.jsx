import React, { useState } from 'react';
import './Login.css';
import Patient from '../../assets/images/patient.png';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                navigate("/dashboard"); // Redirect to the /dashboard
                console.log('Login successful', data);
            } else {
                const data = await response.json();
                setError(data.error);
                console.error('Login failed', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="hospital-login-container">
            <div className="hospital-login-content">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                    <a href="/forgot-password" className="forgot-password">Forgot Password</a>
                </form>
                <p className="signup-link">Don't have an account? <Link to="/register">Signup</Link></p>
            </div>
            <div className="hospital-login-image">
                <div className="image-overlay">
                    <h2> Login Page</h2>
                </div>
                <img src={Patient} alt="Patient Login" />
            </div>
        </div>
    );
};

export default Login;
