// App.js
import React from 'react';
import './App.css';
import Nav from './components/Nav';
import { Routes, Route } from 'react-router-dom';
import HospitalLogin from './components/Login-pages/Hospital-login/HospitalLogin';
import PatientLogin from './components/Login-pages/Patient-login/PatientLogin';

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/hospital-login" element={<HospitalLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
