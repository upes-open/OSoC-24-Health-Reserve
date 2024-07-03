import React from 'react'

const Card = ({ item }) => {
    return (
            <div className="gigCard">
                <img className="img1" src={item.image} alt="" />
                <div className="info">
                    <div className="user">
                        <span>{item.username}</span>
                    </div>
                    <p className="p">{item.hospitalName}</p>
                    <div className="star">
                        <img className="simg" src="/star.png" alt="" />
                        <span className="sstar">{item.dateOfUpload}</span>
                    </div>
                </div>
                <hr className="hr" />
                <div className="details">
                    <img className="img2" src="https://cdn-icons-png.flaticon.com/128/1077/1077035.png" alt="" />
                    <div>
                        <span className="pspan">STARTING AT</span>
                        <h2 className="ph2">${item.dateOfUpload}</h2>
                    </div>
                </div>
            </div>
    )
}

export default Card