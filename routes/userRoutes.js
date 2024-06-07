const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    console.log("User saved successfully:", response);

    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Generated token:", token);

    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.error("Error during signup:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//Login route
router.post("/login", async (req, res) => {
  try {
    const { adharCardNumber, password } = req.body;

    // Find the user by adharCardNumber
    const user = await User.findOne({ adharCardNumber: adharCardNumber });

    // Check if user exists and if the password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(404).json({ error: "Invalid username or password" });
    }

    // Create a payload for the token
    const payload = {
      id: user.id,
    };

    // Generate a token
    const token = generateToken(payload);

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.put('/profile/password',jwtAuthMiddleware, async(req, res) => {
//      try {
//          const userId = req.user;
//          const { currentPassword, newPassword } = req.body;

//            // Find the user by userId
//          const user = await User.findOne(userId);

//          // Check if user exists and if the password is correct
//          if (!(await user.comparePassword(currentPassword))) {
//             return res.status(404).json({ error: "Invalid username or password" });
//          }

//          user.password = newPassword;
//          await user.save();

//          console.log({ msg: "Password Updated" });
//          res.status(200).json(response);
//      } catch (error) {
//         console.log(error);
//         res.status(500).json("internal server error",error);
//      }
// })

// Update password route
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(404).json({ error: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
