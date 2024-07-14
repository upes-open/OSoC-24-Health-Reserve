import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Doctor.css";
import SeePatientCard from "../SeePatients/SeePatientCard"; // Adjust path as per your project structure

const Doctor = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getdata", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/usersdoc", {
          withCredentials: true,
        });
        // console.log("API response:", response.data);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (patients.length === 0) {
    return <div>No patient records found</div>;
  }

  return (
    <div className="main-container">
      {user.role === "Doctor" && <div className="main-head">View Patients</div>}
      {user.role === "Patient" && (
        <div className="main-head">
          View Doctors with access to your records
        </div>
      )}
      <div className="card-container-pat">
        {patients.map((patient) => (
          <SeePatientCard key={patient._id} item={patient} role={user.role} />
        ))}
      </div>
    </div>
  );
};

export default Doctor;
