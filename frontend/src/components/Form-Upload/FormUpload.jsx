import React from 'react';
import { useState } from 'react';
import "./FormUpload.css"

function FormUpload() {
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('doctorName', doctorName);
    formData.append('hospitalName', hospitalName);
    formData.append('date', date);
    formData.append('image', image);

    try {
      const response = await fetch('/upload_record', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      
      console.log('Form submitted successfully');
    } catch (error) {
      setError(error.message);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <div>
      <h2>Medical Form</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Doctor Name:</label>
          <input 
            type="text"
            name="doctorName"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className='doctorName'
          />
        </div>
        <br />
        <br />
        <div>
          <label>Hospital Name:</label>
          <input 
            type="text"
            name="hospitalName"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className='hospitalName'
          />
        </div>
        <br />
        <br />
        <div>
          <label>Date:</label>
          <input 
            type="text"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='date'
          />
        </div>
        <br />
        <br />
        <div>
          <label>Image:</label>
          <input 
            type="file" 
            onChange={handleImageChange}
            className='image'
          />
        </div>
        <br />
        <br />
        <button type="submit" disabled={isSubmitting} className='submit-button' >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default FormUpload;
