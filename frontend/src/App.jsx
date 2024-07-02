/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './App.css';
import Nav from './components/Nav';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login-page/Login';
import Register from './components/Register-page/Register';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';

function App() {
  const location = useLocation();
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

  return (
    <div className="App">
      {location.pathname !== '/' && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      { <Footer />}
    </div>
  );
}

export default App;
