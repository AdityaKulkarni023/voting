// Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        setError("Error retrieving profile");
        console.error("Error retrieving profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <table className="profile-table">
        <tbody>
          <tr>
            <th>Name:</th>
            <td>{user.name}</td>
          </tr>
          <tr>
            <th>Age:</th>
            <td>{user.age}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th>Address:</th>
            <td>{user.address}</td>
          </tr>
          <tr>
            <th>Aadhar Number:</th>
            <td>{user.adharCardNumber}</td>
          </tr>
          <tr>
            <th>Role:</th>
            <td>{user.role}</td>
          </tr>
          <tr>
            <th>Voted:</th>
            <td>{localStorage.getItem("isVoted") === "true" ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
