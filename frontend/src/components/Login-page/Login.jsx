import React, { useState } from 'react';
import './Login.css';
import Patient from '../../assets/images/patient.png';
import { Link, useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Assuming your backend endpoint for login is /api/login
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Assuming your backend returns a JSON object with a token
      const data = await response.json();
      // Store the token in local storage or session storage
      localStorage.setItem('token', data.token);
      // Redirect to the appropriate page after successful login
      history.push('/dashboard'); // Replace with your desired redirect URL
    } else {
      // Handle login failure
      console.error('Login failed');
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="hospital-login-container">
      <div className="hospital-login-content">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password
          </Link>
        </form>
        <p className="signup-link">Dont have an account? <Link to="/patient-register">Signup</Link></p>
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