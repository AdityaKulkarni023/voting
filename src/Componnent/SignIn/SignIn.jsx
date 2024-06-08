import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.css";

const SignIn = ({ onSignInSuccess }) => {
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignInSuccess = () => {
    onSignInSuccess();
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        adharCardNumber: aadhar,
        password: password,
      });

      if (response.data.token) {
        const token = response.data.token;
        // Fetch user profile including role
        const profileResponse = await axios.get(
          "http://localhost:3000/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const role = profileResponse.data.user.role;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        handleSignInSuccess();
      } else {
        setError("Invalid Aadhar number or password");
      }
    } catch (error) {
      setError("Invalid Aadhar number or password");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="title">Sign In</h2>
        {error && <p className="error">{error}</p>}
        <div className="input-group">
          <label htmlFor="aadhar">Aadhar Number:</label>
          <input
            type="text"
            id="aadhar"
            name="aadhar"
            placeholder="Enter Aadhar Number"
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          Sign In
        </button>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
