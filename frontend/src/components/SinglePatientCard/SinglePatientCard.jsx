import React from 'react';
import './SinglePatientCard.css';
import axios from 'axios';

const Card = ({ item, onDelete }) => {
    const formattedDate = new Date(item.dateOfUpload).toLocaleDateString();

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3000/record/${item._id}`);
            onDelete(item._id); // Update state to remove the deleted item from the UI
            alert('Record deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
            // Handle error, show message, etc.
        }
    };

    return (
        <div className="Card">
            <div className="image-container">
                <img src={item.image.data} alt="Patient" className="card-image" />
            </div>
            <div className="info">
                <div className="doctor-name"><span>Doctor Name: </span>{item.doctorName}</div>
                <div className="description"><span>Description: </span>{item.description}</div>
                <div className="hospital"><span>Hospital Name: </span>{item.hospitalName}</div>
            </div>
            <div className="details">
                <span className="uploaded-at">UPLOADED AT</span>
                <div className="date">{formattedDate}</div>
            </div>
            <button onClick={handleDelete} className="delete-button">Delete Record</button>
        </div>
    );
};

export default Card;
