// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Home.css'; 
const Home = () => {
  return (
    <div className="home-container">
      <div className="background-image">
      </div>
      <div className="content">
        <div className="centered-box">
          <h1>Welcome to Health Reserve</h1>
          <p>Your secure solution for managing medical records!</p>
          <div className="button-row">
            <button className="button">Login</button>
            <button className="button">Register</button>
          </div>
          <p className="copyright">© 2024 MedVault. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;