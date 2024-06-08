import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSignInAlt,
  faUserPlus,
  faUser,
  faKey,
  faUserTie,
  faVoteYea,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout, hasVoted }) => {
  const [voteCount, setVoteCount] = useState(0);

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        {!isLoggedIn && (
          <>
            <li className="navbar-item">
              <Link to="/signin" className="navbar-link">
                <FontAwesomeIcon icon={faSignInAlt} /> Sign In
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/signup" className="navbar-link">
                <FontAwesomeIcon icon={faUserPlus} /> Sign Up
              </Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li className="navbar-item">
              <Link to="/profile" className="navbar-link">
                <FontAwesomeIcon icon={faUser} /> Profile
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/update-password" className="navbar-link">
                <FontAwesomeIcon icon={faKey} /> Update Password
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/vote-count" className="navbar-link"> {/* Make Votes clickable */}
                <FontAwesomeIcon icon={faVoteYea} /> Votes
              </Link>
            </li>
          
            <li className="navbar-item">
              <button onClick={onLogout} className="navbar-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
