// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the 'useNavigate' hook from 'react-router-dom'
import './Home.css'; 

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLoginClick = () => {
    navigate('/login'); // Adjust the path to your Login page
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Adjust the path to your Register page
  };
  const handleUploadClick = () => {
    navigate('/upload'); // Adjust the path to your Register page
  };

  return (
    <div className="home-container">
      <div className="background-image"></div>
      <div className="content">
        <div className="centered-box">
          <h1>Welcome to Health Reserve</h1>
          <p>Your secure solution for managing medical records!</p>
          <div className="button-row">
            <button className="button" onClick={handleLoginClick}>Login</button>
            <button className="button" onClick={handleRegisterClick}>Register</button>
            <button className='button' onClick={handleUploadClick}>Upload</button>
          </div>
          <p className="copyright">© 2024 Health Reserve. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
