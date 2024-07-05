import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [itemImages, setItemImages] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('dateOfUpload', date); // Changed to match backend schema
    formData.append('doctorName', doctorName); // Changed to match backend schema
    formData.append('hospitalName', hospitalName); // Changed to match backend schema
    if (itemImages.length > 0) {
      formData.append('image', itemImages[0]); // Adjusted to match Multer field name
    }

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload data: ${errorText}`);
      }

      // Reset form fields after successful submission
      setDescription('');
      setDate('');
      setDoctorName(''); // Changed to match backend schema
      setHospitalName(''); // Changed to match backend schema
      setItemImages([]);
      alert('Data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Failed to upload data.');
    }
  };

  const handleCategoryChange = (e) => {
    setHospitalName(e.target.value); // Changed to match backend schema
  };

  const handleFileChange = (e) => {
    setItemImages(Array.from(e.target.files));
  };

  return (
    <>
      <div className="dashboard">
        <h1 id='reportheader'>Upload Reports</h1>

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
            <label htmlFor="username">
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
                onChange={handleCategoryChange}
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
                  className="select pt-1"
                  type="file"
                  id="itemImages"
                  multiple
                  onChange={handleFileChange}
                  required
                />
              </div>
            </label>
          </div>

        </form>
        
        <div className="col-submit">
          <button type="submit" className="submitbtn"> Submit </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;