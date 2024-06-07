const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: "Token not found" });

    // Extract JWT token from req header
    const token = authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Invalid token" });
    }
};

// Generate token
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '3000s' }); // Changed expiresIn to '3000s' for clarity
};

module.exports = { jwtAuthMiddleware, generateToken };
