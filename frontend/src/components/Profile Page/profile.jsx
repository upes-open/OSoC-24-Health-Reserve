import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email"); // Retrieve email from local storage
      if (!email) {
        setError("No email found in local storage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/user/${email}`); // Use email in API call
        setUser(response.data); // Assuming response.data contains the user object
        setFormData(response.data); // Initialize form data with user data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this effect runs only once

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      // Create a partial object with only the updated fields
      const updatedFields = {};
      if (formData.fullname !== user.fullname)
        updatedFields.fullname = formData.fullname;
      if (formData.age !== user.age) updatedFields.age = formData.age;
      if (formData.gender !== user.gender)
        updatedFields.gender = formData.gender;
      if (formData.username !== user.username)
        updatedFields.username = formData.username;

      if (Object.keys(updatedFields).length > 0) {
        // Only send if there are updates
        const response = await axios.put(
          `http://localhost:3000/user/${user.email}`,
          updatedFields
        );
        setUser(response.data);
        setEditMode(false);
      } else {
        alert("No changes detected");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <div className="profile-page">
        <section className="profile-section">
          <div className="profile-section-2">
            <div className="profile-container">
              <h2 className="profile-heading"> My Profile</h2>
              <p className="profile-para">Good to see you here!</p>
            </div>
            <div className="main-container-profile">
              <div className="first-container">
                <h2 className="contact-heading">Profile</h2>
                <p className="contact-para">
                  <img
                    className="profile-img"
                    src="/profile.png"
                    alt="profile-img"
                  ></img>
                </p>
                <ul className="contact-list">
                  <li className="contact-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16px"
                      fill="#fff"
                      viewBox="0 0 479.058 479.058"
                      height="16px"
                    >
                      <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z"></path>
                    </svg>
                    <a href="#" className="contact-link">
                      {user.email}
                    </a>
                  </li>
                  <li className="contact-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16px"
                      height="16px"
                      fill="#fff"
                      viewBox="0 0 482.6 482.6"
                    >
                      <path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 17.5 47.5 43.9 91.6 83.1 138.7zm-72.6-216.6c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8l-.5.5c-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5-10.3-27.5-14.2-49.6-12.6-69.7z"></path>
                    </svg>
                    <a href="#" className="contact-link">
                      {user.contact}
                    </a>
                  </li>
                  <li className="contact-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16px"
                      height="16px"
                      fill="#fff"
                      viewBox="0 0 368.16 368.16"
                    >
                      <path d="M184.08 0c-74.992 0-136 61.008-136 136 0 24.688 11.072 51.24 11.536 52.36 3.576 8.488 10.576 22.664 13.056 26.952l104.32 148.832c2.368 3.376 6.32 5.408 10.4 5.408s8.032-2.032 10.4-5.408l104.32-148.832c2.488-4.304 9.488-18.472 13.056-26.952.472-1.12 11.536-27.672 11.536-52.36 0-74.992-61.008-136-136-136zm0 342.344L88.36 206.2C74.664 181.688 72.08 156.904 72.08 136c0-61.832 50.336-112.16 112-112.16 61.832 0 112 50.328 112 112.16 0 20.904-2.584 45.688-16.28 70.2L184.08 342.344zm36.6-178.392c-2.44-1.408-4.984-2.592-7.68-3.496 9.336-6.72 15.44-17.688 15.44-30.056 0-20.408-16.6-37.008-37.008-37.008s-37.008 16.6-37.008 37.008c0 12.368 6.104 23.336 15.44 30.056-2.688.904-5.24 2.088-7.68 3.496-14.512 8.416-23.352 23.96-23.352 40.912 0 4.4 3.56 8 8 8h86.848c4.44 0 8-3.6 8-8 0-16.952-8.832-32.504-23.36-40.912zm-29.6-10.248c-11.592 0-21.008-9.416-21.008-21.008s9.416-21.008 21.008-21.008 21.008 9.416 21.008 21.008-9.408 21.008-21.008 21.008zm-43.488 51.16c3.568-14.528 16.664-24.912 31.488-24.912 2.336 0 4.68.248 7.016.76 2.648.552 5.384.552 8.032 0 2.328-.512 4.672-.76 7.016-.76 14.824 0 27.92 10.384 31.488 24.912H147.592zm0 0"></path>
                    </svg>
                    <a href="#" className="contact-link">
                      Dehradun, Uttarakhand
                    </a>
                  </li>
                </ul>
              </div>
              <div className="second-container">
                <div className="main-info">
                  {!editMode ? (
                    <>
                      <div className="username">
                        <span>Username : </span>
                        {user.username}
                      </div>
                      <div className="full-name">
                        <span>Full Name</span> : {user.fullname}
                      </div>
                      <div className="age">
                        <span>Age</span> : {user.age}
                      </div>
                      <div className="gender">
                        <span>Gender</span> : {user.gender}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="username">
                        <span>Username</span> :{" "}
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="full-name">
                        <span>Full Name</span> :{" "}
                        <input
                          type="text"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="age">
                        <span>Age</span> :{" "}
                        <input
                          type="text"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="gender">
                        <span>Gender</span> :{" "}
                        <input
                          type="text"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                  <div className="role">
                    <span>Role</span> : Doctor
                  </div>{" "}
                  {/* Assuming role is fixed */}
                  <div className="prof-button-container">
                    <button onClick={logout} className="profile-logout">
                      Logout
                    </button>
                    {!editMode ? (
                      <button onClick={handleEditClick} className="edit-btn">
                        Edit Profile
                      </button>
                    ) : (
                      <button onClick={handleSaveClick} className="save-btn">
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Profile;
