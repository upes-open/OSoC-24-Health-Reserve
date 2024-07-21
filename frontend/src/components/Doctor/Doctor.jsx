import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Doctor.css";
import SeePatientCard from "../SeePatients/SeePatientCard"; // Adjust path as per your project structure

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctor/patients", {
          withCredentials: true,
        });
        // console.log(response.data)
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error("API request error:", err); // Log any errors
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (patients.length === 0) {
    return <div>No patient records found</div>;
  }

  return (
    <div className="main-container">
      <div className="main-head">View Patients</div>
      <div className="card-container-pat">
        {patients.map((patient) => (
          <SeePatientCard key={patient._id} item={patient} />
        ))}
      </div>
    </div>
  );
};

export default ViewPatients;
