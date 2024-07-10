import React from 'react';
import './SeePatientCard.css';
import { Link } from 'react-router-dom';

const Card = ({ item }) => {
    return (
        <div className="Pat-Card">
            <Link to={`/patient/${item.username}`} className="card-link">
                <div className="info">
                    <div className="doctor-name"><span>Patient Name: </span>{item.username}</div>
                    {item.age && <div><span>Age: </span>{item.age}</div>}
                    {item.gender && <div><span>Gender: </span>{item.gender}</div>}
                    {item.contact && <div><span>Contact: </span>{item.contact}</div>}
                </div>
            </Link>
        </div>
    );
};

export default Card;
