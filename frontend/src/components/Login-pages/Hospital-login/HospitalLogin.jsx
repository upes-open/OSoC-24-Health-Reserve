// import React from 'react';
import './HospitalLogin.css';
import hospitalLoginImage from '../../../assets/images/hospital-login.png';

const HospitalLogin = () => {
  return (
    <div className="hospital-login-container">
      <div className="hospital-login-content">
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="login-button">Login</button> 
          <a href="/forgot-password" className="forgot-password">Forgot Password</a>
        </form>
        <p className="signup-link">Dont have an account? <a href="/signup">Signup</a></p>
      </div>
      <div className="hospital-login-image">
        <div className="image-overlay">
          <h2>Hospital Login</h2>
        </div>
        <img src={hospitalLoginImage} alt="Hospital Login" />
      </div>
    </div>
  );
};

export default HospitalLogin;
