/* eslint-disable no-unused-vars */
// src/components/Navbar/Navpatient.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navdoctor.css';
//import logo from './path/to/logo'; // Update the path to the actual location of your logo

function Navdoctor() {
  return (
    <nav>
      <div className="container">
        <div className="logo">
          <img src="/dummylogo.jpg" alt="Logo" />
          <h1>Health Reserve</h1>
        </div>
        <div className="right">
          <ul className="doc">
            <li><Link to="/contact">CONTACT US</Link></li>
            <li><Link to="/doctors">SEE PATIENTS</Link></li>
          </ul>
          <div className="profile">
            <img src="/profile.jpeg" alt="Profile Picture" />
            <div className="upload-text">Upload Your Image</div>
            <span>Username</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navdoctor;
