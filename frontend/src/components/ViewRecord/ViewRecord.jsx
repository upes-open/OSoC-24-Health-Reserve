import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewRecord.css';
import Card from '../PatientCard/Card'; // Adjust path as per your project structure

const ViewRecord = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatientData = async () => {
            const email = localStorage.getItem('email');
            if (!email) {
                setError('No email found in local storage');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/record/${email}`);
                setPatients(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []);

    const handleDelete = (deletedItemId) => {
        // Filter out the deleted item from the state
        setPatients(patients.filter(patient => patient._id !== deletedItemId));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (patients.length === 0) {
        return <div>No patient records found for this user</div>;
    }

    return (
        <div className="card-container">
            {patients.map(patient => (
                <Card key={patient._id} item={patient} onDelete={handleDelete} />
            ))}
        </div>
    );
};

export default ViewRecord;
