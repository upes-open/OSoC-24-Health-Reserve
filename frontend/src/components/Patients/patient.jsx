import React, { useState, useEffect } from "react";
import axios from "axios";
import "./patient.css";
import SeePatientCard from "../SeePatients/SeePatientCard"; // Adjust path as per your project structure

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/patient/doctors", {
          withCredentials: true,
        });
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.error("API request error:", err); // Log any errors
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (doctors.length === 0) {
    return <div>No doctor records found</div>;
  }

  return (
    <div className="main-container">
      <div className="main-head">View Doctors with access to your records</div>
      <div className="card-container-pat">
        {doctors.map((doctor) => (
          <SeePatientCard key={doctor._id} item={doctor} role="Patient" />
        ))}
      </div>
    </div>
  );
};

export default ViewDoctors;
