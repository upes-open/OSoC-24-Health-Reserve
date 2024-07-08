import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [itemImages, setItemImages] = useState(null);
  const email = localStorage.getItem('email');
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      description : description,
      dateOfUpload: date,
      doctorName : doctorName,
      hospitalName : hospitalName,
      image: itemImages,
      email: email
    };

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload data: ${errorText}`);
      }

      // Reset form fields after successful submission
      setDescription('');
      setDate('');
      setDoctorName('');
      setHospitalName('');
      setItemImages(null);
      alert('Data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Failed to upload data.');
    }
  };

  const convertToBase64 = (e) => {
    console.log(e);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
        setItemImages(reader.result); // Store the base64 string
      };
    }
  };

  return (
    <div className="dashboard">
      <h1 id="reportheader">Upload Reports</h1>

      <form className="dashboardForm" onSubmit={handleFormSubmit}>
        <div className="col-5">
          <label htmlFor="description">
            Description
            <input
              type="text"
              id="description"
              value={description}
              placeholder="Enter description of the item"
              onChange={(e) => setDescription(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
        </div>

        <div className="col-4">
          <label htmlFor="date">
            Date
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
        </div>

        <div className="col-3">
          <label htmlFor="doctorName">
            Doctor Name
            <input
              type="text"
              id="doctorName"
              value={doctorName}
              placeholder="Enter your name"
              onChange={(e) => setDoctorName(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
        </div>

        <div className="col-3">
          <label htmlFor="hospitalName">
            Hospital Name
            <input
              type="text"
              id="hospitalName"
              value={hospitalName}
              placeholder="Enter hospital name"
              onChange={(e) => setHospitalName(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
        </div>

        <div className="col-3">
          <label htmlFor="itemImages">
            Please upload your reports
            <div>
              <input
                className="select"
                accept="image/*"
                type="file"
                id="itemImages"
                onChange={convertToBase64}
                required
              />
            </div>
          </label>
        </div>

        <div className="col-submit">
          <button type="submit" className="submitbtn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;