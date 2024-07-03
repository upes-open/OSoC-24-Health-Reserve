import React from 'react'
import './Card.css';

const Card = ({item}) => {
    return (
        <div className="Card">
            <img className="img1" src={item.image} alt="" />
            <div className="info">
                <div className="user">
                    <span>{item.username}</span>
                </div>
                <p className="p">KLD</p>
                <span className="sstar">{item.hospitalName}</span>
            </div>
            <hr className="hr" />
            <div className="details">
                <div>
                    <span className="pspan">UPLOADED AT</span>
                    <h2 className="ph2">{item.dateOfUpload}</h2>
                </div>
            </div>
        </div>
    )
}

export default Card