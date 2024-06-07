const express = require("express");
const app = express();
const db = require("./db");
require("dotenv").config();
const cors = require("cors");

const bodyParser = require("body-parser");
// Middleware for parsing JSON bodies
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;

// Import routes
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
