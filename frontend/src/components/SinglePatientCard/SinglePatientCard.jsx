import { useState } from 'react';
import React from 'react';
import './SinglePatientCard.css';


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


const Card = ({ item }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleImageClick = () => {
        setIsFullScreen(true);
    };

    const handleClose = () => {
        setIsFullScreen(false);
    };

    const formattedDate = new Date(item.dateOfUpload).toLocaleDateString();

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
            </div>
            {isFullScreen && (
                <FullScreenModal image={item.image.data} onClose={handleClose} />
            )}
        </>
    );
};

export default Card;
