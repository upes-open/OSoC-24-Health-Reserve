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
      try {
        const response = await axios.get("http://localhost:3000/getdata", {
          withCredentials: true,
        }); 
        setUser(response.data); 
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
          <img src="/logo.png" alt="Logo" />
          <h1>Health Reserve</h1>
        </div>
        <div className="right">
          <ul className="doc">
            <li>
              <Link to="/contact">CONTACT US</Link>
            </li>
            {user.role === "Doctor" && <li>
              <Link to="/doctors">SEE PATIENTS</Link>
            </li>}
            {user.role === "Patient" &&
              (<>
              <li>
                <Link to="/doctors">SEE DOCTORS</Link>
              </li>
              <li>
                <Link to="/doctors">UPLOAD RECORDS</Link>
              </li>
              </>)}
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