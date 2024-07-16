import React from "react";
import "./SeePatientCard.css";
import { Link } from "react-router-dom";

const SeePatientCard = ({ item, role }) => {
  console.log(item);
  return (
    <div className="Pat-Card">
      {role === "Doctor" && (
        <div className="info">
          <div className="patient-name">
            <span>Patient Name: </span>
            {item.username}
          </div>
          {item.age && (
            <div>
              <span>Age: </span>
              {item.age}
            </div>
          )}
          {item.gender && (
            <div>
              <span>Gender: </span>
              {item.gender}
            </div>
          )}
          {item.contact && (
            <div>
              <span>Contact: </span>
              {item.contact}
            </div>
          )}
        </div>
      )}
      {role === "Patient" && (
        <Link to={`/patient/${item.username}`} className="card-link">
          <div className="info">
            <div className="doctor-name">
              <span>Doctor Name: </span>
              {item.username}
            </div>
            {item.specialization && (
              <div>
                <span>Specialization: </span>
                {item.specialization}
              </div>
            )}
            {item.contact && (
              <div>
                <span>Contact: </span>
                {item.contact}
              </div>
            )}
          </div>
        </Link>
      )}
    </div>
  );
};

export default SeePatientCard;
