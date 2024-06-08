import React, { useState, useEffect } from "react";
import "./Voter.css";
import voteSound from "../assets/voteSound.mp3";

const parties = [
  {
    id: 1,
    name: "BJP",
    symbol: "/assets/BJP.png",
    candidate: "/assets/candidateA.png",
  },
  {
    id: 2,
    name: "Congress",
    symbol: "/assets/INC.png",
    candidate: "/assets/candidateB.png",
  },
  {
    id: 3,
    name: "AAP",
    symbol: "/assets/AAP.png",
    candidate: "/assets/candidateC.png",
  },
  {
    id: 4,
    name: "NCP",
    symbol: "/assets/SP.png",
    candidate: "/assets/candidateD.png",
  },
  {
    id: 5,
    name: "GDP",
    symbol: "/assets/BSP.png",
    candidate: "/assets/candidateE.png",
  },
  {
    id: 6,
    name: "Other",
    symbol: "/assets/TMC.png",
    candidate: "/assets/candidateF.png",
  },
];

const Voter = () => {
  const [selectedParty, setSelectedParty] = useState(null);
  const [voted, setVoted] = useState(false);

  const voteAudio = new Audio(voteSound);
  const handleVote = (party) => {
    setSelectedParty(party);
    setVoted(true);
    voteAudio.play();
  };

  useEffect(() => {
    if (voted) {
     
      setTimeout(() => {
        localStorage.setItem("isVoted", true);
      }, voteAudio.duration * 1000); 
    }
  }, [voted, voteAudio.duration]);

  return (
    <div className="voter-panel">
      <h1>Vote for Your Party</h1>
      <div className="party-list">
        {parties.map((party) => (
          <div key={party.id} className="party-item">
            <div className="party-info">
              <img
                src={party.symbol}
                alt={`${party.name} symbol`}
                className="party-symbol"
              />
              <img
                src={party.candidate}
                alt={`${party.name} candidate`}
                className="candidate-pic"
              />
            </div>
            <button
              onClick={() => handleVote(party)}
              className={`party-button ${
                selectedParty === party ? "selected" : ""
              }`}
              disabled={voted}
            >
              {party.name}
            </button>
          </div>
        ))}
      </div>
      {selectedParty && (
        <div className="vote-confirmation">
          You have voted for {selectedParty.name}
        </div>
      )}
    </div>
  );
};

export default Voter;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./Voter.css";
// import voteSound from "../assets/voteSound.mp3";

// const Voter = () => {
//   const [parties, setParties] = useState([]);
//   const [selectedParty, setSelectedParty] = useState(null);
//   const [voted, setVoted] = useState(false);

//   useEffect(() => {
//     fetchCandidates();
//     const interval = setInterval(fetchCandidates, 5000); // Fetch every 5 seconds
//     return () => clearInterval(interval); // Clear interval on component unmount
//   }, []);

//   const fetchCandidates = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/user/candidates");
//       setParties(response.data);
//     } catch (error) {
//       console.error("Error fetching candidates:", error);
//     }
//   };

//   const voteAudio = new Audio(voteSound);

//   const handleVote = async (party) => {
//     const token = localStorage.getItem("token");
//     try {
//       await axios.post(`http://localhost:3000/user/vote/${party._id}`, null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSelectedParty(party);
//       setVoted(true);
//       voteAudio.play();
//     } catch (error) {
//       console.error("Error voting for candidate:", error);
//     }
//   };

//   return (
//     <div className="voter-panel">
//       <h1>Vote for Your Party</h1>
//       <div className="party-list">
//         {parties.map((party) => (
//           <div key={party._id} className="party-item">
//             <div className="party-info">
//               <img
//                 src={party.symbol}
//                 alt={`${party.party} symbol`}
//                 className="party-symbol"
//               />
//               <img
//                 src={party.candidate}
//                 alt={`${party.party} candidate`}
//                 className="candidate-pic"
//               />
//             </div>
//             <button
//               onClick={() => handleVote(party)}
//               className={`party-button ${
//                 selectedParty === party ? "selected" : ""
//               }`}
//               disabled={voted}
//             >
//               {party.party}
//             </button>
//           </div>
//         ))}
//       </div>
//       {selectedParty && (
//         <div className="vote-confirmation">
//           You have voted for {selectedParty.party}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Voter;
