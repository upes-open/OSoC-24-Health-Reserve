/* eslint-disable no-unused-vars */
// src/components/Navbar/Navpatient.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navdoctor.css";
import axios from "axios";
import { useState, useEffect } from "react";
//import logo from './path/to/logo'; // Update the path to the actual location of your logo

function Navdoctor() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("profile");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email"); // Retrieve email from local storage
      if (!email) {
        setError("No email found in local storage");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/user/${email}`); // Use email in API call
        setUser(response.data); // Assuming response.data contains the user object
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <nav>
      <div className="container">
        <div className="logo">
          <img src="/dummylogo.jpg" alt="Logo" />
          <h1>Health Reserve</h1>
        </div>
        <div className="right">
          <ul className="doc">
            <li>
              <Link to="/contact">CONTACT US</Link>
            </li>
            <li>
              <Link to="/doctors">SEE PATIENTS</Link>
            </li>
          </ul>
          <div className="profile" onClick={handleClick}>
            <img src="/profile.jpeg" alt="Profile Picture" />
            <div className="upload-text">Upload Your Image</div>
            <span>{user.username}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navdoctor;
