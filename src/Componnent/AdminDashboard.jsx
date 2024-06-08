import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Componnent/styles/AdminDashboard.css'
const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [age, setAge] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
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

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/candidate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidates(response.data);
    } catch (error) {
      setError("Error fetching candidates");
      console.error("Error fetching candidates:", error);
    }
  };

  const handleAddOrUpdateCandidate = async () => {
    try {
      if (selectedCandidateId) {
        // Update candidate
        await axios.put(
          `http://localhost:3000/candidate/${selectedCandidateId}`,
          { name, party, age },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess("Candidate updated successfully");
      } else {
        // Add new candidate
        await axios.post(
          "http://localhost:3000/candidate",
          { name, party, age },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess("Candidate added successfully");
      }
      setName("");
      setParty("");
      setAge("");
      setSelectedCandidateId(null);
      fetchData(); // Refresh candidate list
    } catch (error) {
      setError("Error adding/updating candidate");
      console.error("Error adding/updating candidate:", error);
    }
  };

  const handleEditCandidate = (candidate) => {
    setName(candidate.name);
    setParty(candidate.party);
    setAge(candidate.age);
    setSelectedCandidateId(candidate._id);
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      await axios.delete(`http://localhost:3000/candidate/${candidateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Candidate deleted successfully");
      fetchData(); // Refresh candidate list
    } catch (error) {
      setError("Error deleting candidate");
      console.error("Error deleting candidate:", error);
    }
  };

  return (
    <div className="admin-dashboard-container"> {/* Apply the container class */}
      <h2>Admin Dashboard</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>} {/* Apply the error class */}
      {success && <p className="success">{success}</p>} {/* Apply the success class */}
      <h3>{selectedCandidateId ? "Edit" : "Add"} Candidate</h3>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Party:</label>
        <input
          type="text"
          value={party}
          onChange={(e) => setParty(e.target.value)}
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <button onClick={handleAddOrUpdateCandidate}>
        {selectedCandidateId ? "Update" : "Add"} Candidate
      </button>
      <h3>Candidates</h3>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate._id}>
            {candidate.name} - {candidate.party} - {candidate.age}{" "}
            <button onClick={() => handleEditCandidate(candidate)}>Edit</button>
            <button onClick={() => handleDeleteCandidate(candidate._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default AdminDashboard;
