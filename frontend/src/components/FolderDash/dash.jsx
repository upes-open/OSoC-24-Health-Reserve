import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dash.css';

const Dash = () => {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [revokeDoctor, setRevokeDoctor] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/getdata", {
                    withCredentials: true, // Ensure cookies are sent
                });
                setUser(response.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchUserData();
    }, []);

    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
    };

    const handleRevokeDoctorChange = (event) => {
        setRevokeDoctor(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/grant-access", {
                selectedDoctor
            }, {
                withCredentials: true, // Ensure cookies are sent
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                console.log('Access shared successfully');
                alert('Access shared successfully');
                setSelectedDoctor(''); // Clear input field after successful submission
            } else {
                console.error('Failed to share access:', response.data.message);
                alert(`Failed to share access: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error sharing access:', error.message);
            alert('Error sharing access');
        }
    };

    const handleRevokeSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/revoke-access", {
                revokeDoctor
            }, {
                withCredentials: true, // Ensure cookies are sent
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                console.log('Access revoked successfully');
                alert('Access revoked successfully');
                setRevokeDoctor(''); // Clear input field after successful submission
            } else {
                console.error('Failed to revoke access:', response.data.message);
                alert(`Failed to revoke access: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error revoking access:', error.message);
            alert('Error revoking access');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="full-dash-container">
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

            {user.role === "Patient" && <div className="forms-container">
                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-group-dash">
                        <label htmlFor="doctor">Doctor's Email:</label>
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

                <form onSubmit={handleRevokeSubmit} className="appointment-form">
                    <div className="form-group-dash">
                        <label htmlFor="revokeDoctor">Doctor's Email:</label>
                        <input
                            type="text"
                            id="revokeDoctor"
                            value={revokeDoctor}
                            onChange={handleRevokeDoctorChange}
                            placeholder="Enter doctor's Email"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button revoke-button">Revoke Access</button>
                </form>
            </div>}
        </div>
    );
};

export default Dash;
