import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Componnent/styles/VoterDashboard.css";
const VoterDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/candidate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCandidates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setError("Error fetching candidates");
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [token]);

  const handleVote = async (candidateId) => {
    try {
      await axios.post(
        `http://localhost:3000/candidate/vote/${candidateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Vote recorded successfully");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("You have already voted for this candidate");
      } else {
        setError("Error recording vote. Please try again.");
        console.error("Error recording vote:", error);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Voter Dashboard</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Party</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate._id}>
              <td className="candidate-name">{candidate.name}</td>
              <td>{candidate.party}</td>
              <td>{candidate.age}</td>
              <td>
                <button className="candidate-button" onClick={() => handleVote(candidate._id)}>Vote</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
        
};

export default VoterDashboard;
