/* eslint-disable no-unused-vars */
import React from 'react';
import './App.css';
import Nav from './components/Nav';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login-page/Login';
import Register from './components/Register-page/Register';

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
