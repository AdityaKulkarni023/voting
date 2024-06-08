import React, { useState, useEffect } from "react";
import "../Componnent/styles/VoteCounts.css";

const VoteCounts = () => {
  const [voteCounts, setVoteCounts] = useState([]);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/candidate/vote/count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vote counts");
        }
        const data = await response.json();
        setVoteCounts(data);
      } catch (error) {
        console.error("Error fetching vote counts:", error);
      }
    };

    fetchVoteCounts(); // Fetch vote counts when the component mounts

    // Set up interval to fetch vote counts every 10 seconds
    const intervalId = setInterval(fetchVoteCounts, 10000);

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, []);

  return (
    <div className="vote-counts-container">
      <h2 className="vote-counts-header">Live Vote Counts</h2>
      <table className="vote-counts-table">
        <thead>
          <tr>
            <th>Party</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {voteCounts.map((candidate) => (
            <tr key={candidate.party}>
              <td>{candidate.party}</td>
              <td>{candidate.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoteCounts;
