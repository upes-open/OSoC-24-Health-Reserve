// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './ViewRecord.css';
import hospitalRegisterImage from '../../assets/images/Doctors-home.png';
import Card from '../PatientCard/Card';

const ViewRecord = () => {

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('/getrecords');
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatients();
    }, []);


    return (
        <div className="hospital-register-container">
            <div className="register-content">
                <div className="register-info">
                </div>
                <div className="hospital-register-image">
                    <img src={hospitalRegisterImage} alt="Hospital Register" />
                </div>
            </div>
            <h2> Patient Info </h2>
            <div className="register-form-container">
                {patients.map((patient) => (
                    <Card key={patient._id} item={patient} />
                ))}
            </div>
        </div>
    );
};

export default ViewRecord;
