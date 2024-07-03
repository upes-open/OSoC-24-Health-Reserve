// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './Dashboard.css';
// import image from '../../assets/images/bg.jpg';

const Dashboard = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [itemImages, setItemImages] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('date', date);
    formData.append('name', name);
    formData.append('category', category);
    itemImages.forEach((image, index) => {
      formData.append(`itemImages[${index}]`, image);
    });

  

      // Reset form fields after successful submission
      
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    // document.body.style.background = url(${image});
    document.body.style.backgroundSize = 'cover';

    return () => {
      document.body.style.background = null;
    };
  }, []);

  const handleFileChange = (e) => {
    setItemImages(Array.from(e.target.files));
  };

  return (
    <>
    <div className="dashboard">
      <h1 id='reportheader'>Upload Reports</h1>

      <form  className ="dashboardForm"onSubmit={handleFormSubmit}>
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
            />
          </label>
        </div>

        <div className="col-3">
          <label htmlFor="name">
            Doctor Name
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="col-3">
          <label htmlFor="category">
            Hospital Name
            <input
              type="text"
              id="category"
              value={category}
              placeholder="Enter hospital name"
              onChange={handleCategoryChange}
              required />
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
    </>
  );
};

export default Dashboard;