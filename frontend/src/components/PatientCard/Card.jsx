import React from 'react';
import './Card.css'; // Import your CSS file for styling

const Card = ({ item }) => {
    const formattedDate = new Date(item.dateOfUpload).toLocaleDateString();

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
        </div>
    );
};

export default Card;