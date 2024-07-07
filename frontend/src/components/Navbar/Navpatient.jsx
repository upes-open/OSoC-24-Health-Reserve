// src/components/Navbarpatient/Navpatient.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navdoctor.css';
//import logo from './path/to/logo'; // Update the path to the actual location of your logo

function Navpatient() {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('profile');
  }

  return (
    <nav>
      <div className="logo">
        <img src="/dummylogo.jpg" alt="Logo" />
        <h1>Your Organization Name</h1>
      </div>
      <ul>
        <li><Link to="/contact">CONTACT US</Link></li>
        <li><Link to="/doctors">SEE DOCTORS</Link></li>
        <li><Link to="/upload">UPLOAD RECORDS</Link></li>
      </ul>
      <div className="profile" onClick={handleClick}>
        <img src="/profile.jpeg" alt="Profile Picture" />
        <div className="upload-text">Upload Your Image</div>
        <span>Username</span>
      </div>
    </nav>
  );
}

export default Navpatient;