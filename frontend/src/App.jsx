/* eslint-disable no-unused-vars */
import React from 'react';
import './App.css';
import Nav from './components/Nav';
import { Routes, Route } from 'react-router-dom';
import HospitalLogin from './components/Login-pages/Hospital-login/HospitalLogin';
import PatientLogin from './components/Login-pages/Patient-login/PatientLogin';
import HospitalRegister from './components/Register-pages/Hospital-register/HospitalRegister';
import PatientRegister from './components/Register-pages/Patient-register/PatientRegister';

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/hospital-login" element={<HospitalLogin />} />
        <Route path="/hospital-register" element={<HospitalRegister />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
