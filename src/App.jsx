import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Componnent/Navbar/Navbar";
import SignIn from "./Componnent/SignIn/SignIn";
import VoterDashboard from "./Componnent/VoterDashboard"; // Import the VoterDashboard component
import AdminDashboard from "./Componnent/AdminDashboard";
import SignUp from "./Componnent/SignUp/SignUp";
import Profile from "./Componnent/Profile/Profile";
import UpdatePassword from "./Componnent/UpdatePassword/UpdatePassword";
import axios from "axios";
import VoteCounts from "./Componnent/VoteCounts";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3000/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setIsAuthenticated(true);
        setRole(response.data.user.role);
        setIsLoggedIn(true);
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        setIsAuthenticated(false);
      });
    }
  }, []);

  const handleSignInSuccess = () => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3000/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setIsAuthenticated(true);
      setRole(response.data.user.role);
      setIsLoggedIn(true);
    })
    .catch(error => {
      console.error("Error fetching profile:", error);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <VoterDashboard />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route path="/signin" element={<SignIn onSignInSuccess={handleSignInSuccess} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" />} />
        <Route path="/update-password" element={isLoggedIn ? <UpdatePassword /> : <Navigate to="/signin" />} />
        <Route path="/admin" element={isAuthenticated && role === "admin" ? <AdminDashboard /> : <Navigate to="/signin" />} />
        <Route path="/vote-count" element={<VoteCounts />} /> {/* Corrected path */}

      </Routes>
    </Router>
  );
};

export default App;
