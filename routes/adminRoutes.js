// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware } = require("../jwt");

// Middleware to check if user has admin role
const checkAdminRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === "admin") {
      return next();
    } else {
      return res.status(403).json({ msg: "User does not have admin role" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Admin route to get all users
router.get("/users", jwtAuthMiddleware, checkAdminRole, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Admin route to change a user's role
router.put(
  "/user/:userID/role",
  jwtAuthMiddleware,
  checkAdminRole,
  async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.userID,
        { role },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

module.exports = router;
