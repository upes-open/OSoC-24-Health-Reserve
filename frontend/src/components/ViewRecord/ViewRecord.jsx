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

    // useEffect(() => {
    //     const mockPatients = [
    //         {
    //             _id: 1,
    //             description: "Patient description 1",
    //             username: "Patient1",
    //             hospitalName: "Hospital A",
    //             dateOfUpload: new Date(),
    //             image: "https://plus.unsplash.com/premium_photo-1692574096074-85b35e49a818?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" 
    //         },
    //         {
    //             _id: 2,
    //             description: "Patient description 2",
    //             username: "Patient2",
    //             hospitalName: "Hospital B",
    //             dateOfUpload: new Date(),
    //             image: "https://plus.unsplash.com/premium_photo-1692574096074-85b35e49a818?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" 
    //         }
    //     ];

    //     setPatients(mockPatients);
    // }, []);


    return (
        <div className="record-container">
            <div className="cont">
                <h2> Patient Info </h2>
                <div className="record-card-container">
                    {patients.map((patient) => (
                        <Card key={patient._id} item={patient} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewRecord;
