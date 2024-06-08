import React, { useState, useEffect } from "react";
import axios from "axios";

const VotingPage = ({ user }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("/candidate");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleVote = async (candidateID) => {
    try {
      await axios.post(`/candidate/vote/${candidateID}`);
      fetchCandidates();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div>
      <h1>Voting Page</h1>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate._id}>
            <span>
              {candidate.name} ({candidate.party}) - Votes:{" "}
              {candidate.voteCount}
            </span>
            {!user.isVoted && (
              <button onClick={() => handleVote(candidate._id)}>Vote</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingPage;
