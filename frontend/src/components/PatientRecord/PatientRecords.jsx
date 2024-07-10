import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PatientRecords.css'; // Add styling as needed


const PatientRecords = () => {
    const { username } = useParams();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/getrecords/${username}`);
                // console.log(`${username}`)
                // console.log(`http://localhost:3000/record/${username}`)
                // console.log(response)
                setRecords(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchRecords();
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (records.length === 0) {
        return <div>No records found for {username}</div>;
    }

    return (
        <div className='records-container'>
            <div className='records-head'>Records for {username}</div>
            {records.map(record => (
                <div key={record._id} className='record-card'>
                    <div><span>Description: </span>{record.description}</div>
                    <div><span>Doctor Name: </span>{record.doctorName}</div>
                    <div><span>Hospital Name: </span>{record.hospitalName}</div>
                    <div><span>Date of Upload: </span>{new Date(record.dateOfUpload).toLocaleDateString()}</div>
                    {/* Add more fields as needed */}
                </div>
            ))}
        </div>
    );
};

export default PatientRecords;