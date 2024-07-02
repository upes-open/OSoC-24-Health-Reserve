// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashBoard.css';
import image from '../../assets/images/bg.jpg';

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

    try {
      await axios.post('https://lost-and-found.cyclic.app/api/submitLostItem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form fields after successful submission
      setDescription('');
      setDate('');
      setName('');
      setCategory('');
      setItemImages([]);
    } catch (error) {
      console.log('Error submitting form:', error);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    document.body.style.background = `url(${image})`;
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
      <h1>Upload Reports</h1>

      <form onSubmit={handleFormSubmit}>
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
            <select
              className="pb-1 pt-2"
              id="category"
              value={category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select hospitals</option>
              <option value="">Doon hospita</option>
              <option value="">hospital via api</option>
              <option value="">hospital via api2</option>
            </select>
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
    </>
  );
};

export default Dashboard;
