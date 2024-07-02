import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import hospitalRegisterImage from '../../assets/images/Doctors-home.png';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = 'Name is required';
    if (!form.contact) newErrors.contact = 'Contact is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
          credentials: 'include', // This is important for sending cookies
        });

        if (!response.ok) throw new Error('Failed to register');

        const data = await response.json();
        console.log('User registered:', data);
        // Store token or redirect as necessary
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="hospital-register-container">
      <div className="register-content">
        <div className="register-info">
          <h2>Register Form</h2>
        </div>
        <div className="hospital-register-image">
          <img src={hospitalRegisterImage} alt="Hospital Register" />
        </div>
      </div>
      <div className="register-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={form.termsAccepted}
                onChange={handleChange}
              />
              I confirm that the details provided are correct
            </label>
            {errors.termsAccepted && <p className="error">{errors.termsAccepted}</p>}
          </div>
          <button type="submit" className="register-button">Register</button>
          <p className="signup-link">Do you have an account? <Link to="/hospital-login">Login</Link></p>

        </form>
      </div>
    </div>
  );
};

export default Register;