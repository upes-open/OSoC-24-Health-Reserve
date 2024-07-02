/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './App.css';
import Navpatient from './components/Navbar/Navpatient';
import Navdoctor from './components/Navbar/Navdoctor';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login-page/Login';
import Register from './components/Register-page/Register';
// import ViewRecord from './components/ViewRecord/ViewRecord';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Dashboard from './components/User-Upload-Dashboard/userDashboard';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('.footer');
      if (!footer) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const footerOffset = footer.offsetTop;

      if (scrollPosition >= footerOffset) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log(location.pathname); // Debugging log

  return (
    <div className="App">
      {!isHome && <Navdoctor />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/' element={<Home />} />
        <Route path="/navpatient" element={<Navpatient />} />
        <Route path="/navdoctor" element={<Navdoctor />} />
<<<<<<< HEAD
        <Route path="/upload" element={<Dashboard />} />
=======
        {/* <Route path="/viewrecord" element={<ViewRecord />} /> */}
>>>>>>> fbb73af5ac8b1851069a982f39d1c756cad14025
      </Routes>
      {!isHome && <Footer />}
    </div>
  );
}

export default App;
