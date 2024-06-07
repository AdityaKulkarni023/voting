const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// Middleware to check if user has admin role
const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user && user.role === "admin") {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// POST route to add candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ msg: "User does not have admin role" });
    }

    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("Candidate saved successfully:", response);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error during candidate creation:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// PUT route to update candidate
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ msg: "User does not have admin role" });
    }

    const candidateID = req.params.candidateID;
    const updateCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateID, updateCandidateData, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate data updated");
    res.status(200).json(response);
  } catch (error) {
    console.error("Error during candidate update:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// DELETE route to delete candidate
router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ msg: "User does not have admin role" });
    }

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate deleted");
    res.status(200).json({ msg: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error during candidate deletion:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// GET route to fetch all candidates
router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// POST route to vote for a candidate
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  const candidateID = req.params.candidateID;
  const userID = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.isVoted) {
      return res.status(403).json({ msg: "User has already voted" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ msg: "Admin is not allowed to vote" });
    }

    candidate.votes.push({ user: userID });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({ msg: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error recording vote:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// GET route to fetch vote counts
router.get("/vote/count", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: "desc" });
    const voteRecord = candidates.map((data) => ({
      party: data.party,
      count: data.voteCount,
    }));
    res.status(200).json(voteRecord);
  } catch (error) {
    console.error("Error fetching vote counts:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
