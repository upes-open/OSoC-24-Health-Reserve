import React from 'react'
import './Card.css';

const Card = ({item}) => {

    const formattedDate = new Date(item.dateOfUpload).toLocaleDateString();

    return (
        <div className="Card">
            <img className="img1" src={item.image} alt="" />
            <div className="info">
                <div className="user">
                    <span>{item.username}</span>
                </div>
                <p className="p">{item.description}</p>
                <span className="sstar">{item.hospitalName}</span>
            </div>
            <hr className="hr" />
            <div className="details">
                <div>
                    <span className="pspan">UPLOADED AT</span>
                    <h2 className="ph2">{formattedDate}</h2>
                </div>
            </div>
        </div>
    )
}

export default Card