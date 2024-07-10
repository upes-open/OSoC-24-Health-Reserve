import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PatientRecords.css"; // Add styling as needed
import Card from "../SinglePatientCard/SinglePatientCard";

const PatientRecords = () => {
  const { username } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getrecords/${username}`
        );
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
    <div className="records-container">
      <div className="records-head">Records for {username}</div>
      {records.map((record) => (
        <Card key={record._id} item={record} />
      ))}
    </div>
  );
};

export default PatientRecords;
