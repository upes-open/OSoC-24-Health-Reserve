import React from 'react';
import './dash.css';

const Try = () => {
    return (
        <div className="dash-container" id='box'>
          <div className="dash">
            <h2 className="dash-title">Online Appointment Scheduling</h2>
            <p className="dash-description">Our medical website allows patients to schedule appointments online with ease. Choose your preferred doctor and time slot, and get instant confirmation.</p>
          </div>
          <div className="dash">
            <h2 className="dash-title">24/7 Telemedicine Services</h2>
            <p className="dash-description">Access healthcare from the comfort of your home with our 24/7 telemedicine services. Consult with healthcare professionals through video calls anytime, anywhere.</p>
          </div>
          <div className="dash">
            <h2 className="dash-title">Comprehensive Health Records</h2>
            <p className="dash-description">Our platform offers a secure and comprehensive digital health record system. Track your medical history, lab results, and prescriptions in one place.</p>
          </div>
        </div>
    );
};

export default Try;
