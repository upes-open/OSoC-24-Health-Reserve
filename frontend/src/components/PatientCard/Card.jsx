import React from 'react';
import { useState } from 'react';
import './Card.css';
import axios from 'axios';


const FullScreenModal = ({ image, onClose }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fullscreen-modal" onClick={handleBackdropClick}>
            <img src={image} alt="Patient Fullscreen" className="fullscreen-image" />
        </div>
    );
};


const Card = ({ item, onDelete }) => {

    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleImageClick = () => {
        setIsFullScreen(true);
    };

    const handleClose = () => {
        setIsFullScreen(false);
    };


    const formattedDate = new Date(item.dateOfUpload).toLocaleDateString();

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3000/record/${item._id}`);
            onDelete(item._id); // Update state to remove the deleted item from the UI
            alert('Record deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <>
            <div className="Card">
                <div className="image-container">
                    <img src={item.image.data} alt="Patient" className="card-image" onClick={handleImageClick} />
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
            {isFullScreen && (
                <FullScreenModal image={item.image.data} onClose={handleClose} />
            )}
        </>
    );
};

export default Card;
