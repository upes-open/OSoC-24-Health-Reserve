import React, { useState } from 'react';
import './dash.css';

const Try = () => {
    const [selectedDoctor, setSelectedDoctor] = useState('');

    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Retrieve email from local storage
        const userEmail = localStorage.getItem("email");

        try {
            const response = await fetch(`http://localhost:3000/grant-access/${userEmail}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedDoctor }),
            });

            if (response.ok) {
                console.log('Access shared successfully');
                alert('Access shared successfully');
                setSelectedDoctor(''); // Clear input field after submission
            } else {
                const errorData = await response.json();
                console.error('Failed to share access:', errorData.message);
                alert(`Failed to share access: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error sharing access:', error);
            alert('Error sharing access');
        }
    };

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

            <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-group">
                    <label htmlFor="doctor">Enter Doctor's Email:</label>
                    <input
                        type="text"
                        id="doctor"
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        placeholder="Enter doctor's Email"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Share Access</button>
            </form>
        </div>
    );
};

export default Try;