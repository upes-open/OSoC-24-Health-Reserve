import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <nav>
      <div className="logo-container">
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/hospital-login">Hospital Login</Link></li>
        <li><Link to="/patient-login">Patient Login</Link></li>
      </ul>
    </nav>
  );
}

export default Nav;
