// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import hospitalRegisterImage from '../../assets/images/Doctors-home.png';

const Register = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    hospitalName: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    role: '',
    license: ''
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

    if (!form.hospitalName) newErrors.hospitalName = ' Name is required';
    if (!form.contact) newErrors.contact = 'Contact is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    if (form.role === 'Doctor' && !form.license) newErrors.license = 'License is required for doctors';

    return newErrors;
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setForm({
      ...form,
      role: value,
      license: value === 'Doctor' ? form.license : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    }
    else {
      try {
        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: form.hospitalName,
            contact: form.contact,
            email: form.email,
            password: form.password,
            role: form.role,
            license: form.license,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Successfully registered, you may now login using your credentials!")
          navigate('/login')
          console.log('User registered successfully', data);
        } else {
          console.error('Failed to register user');
          alert("Failed to register user");
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="hospital-register-container">
      <div className="register-content">
        <div className="register-info">
          <h2> Register Form</h2>
        </div>
        <div className="hospital-register-image">
          <img src={hospitalRegisterImage} alt="Hospital Register" />
        </div>
      </div>
      <div className="register-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="hospitalName"> Name</label>
            <input
              type="text"
              id="hospitalName"
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              required
            />
            {errors.hospitalName && <p className="error">{errors.hospitalName}</p>}
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
          <div className="form-group2">
            <label>Role</label>
            <div className="options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Doctor"
                  checked={form.role === 'Doctor'}
                  onChange={handleRoleChange}
                  required
                />
                Doctor
              </label>
              {form.role === 'Doctor' && (
                <div>
                  <label htmlFor="license">License</label>
                  <input
                    type="text"
                    id="license"
                    name="license"
                    value={form.license}
                    onChange={handleChange}
                    required
                  />
                  {errors.license && <p className="error">{errors.license}</p>}
                </div>
              )}
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Patient"
                  checked={form.role === 'Patient'}
                  onChange={handleRoleChange}
                  required
                />
                Patient
              </label>
            </div>
            {errors.role && <p className="error">{errors.role}</p>}
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={form.termsAccepted}
                onChange={handleChange}
                required
              />
              I confirm that the details provided are correct
            </label>

            {errors.termsAccepted && <p className="error">{errors.termsAccepted}</p>}
          </div>
          <button type="submit" className="register-button">Register</button>
          <p className="signup-link">Do you have an account? <Link to="/login">Login</Link></p>

        </form>
      </div>
    </div>
  );
};

export default Register;
