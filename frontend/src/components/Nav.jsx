/* eslint-disable no-unused-vars */
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
        <li><Link to="/login"> Login</Link></li>
        <li><Link to="/register"> Register</Link></li>
      </ul>
    </nav>
  );
}

export default Nav;