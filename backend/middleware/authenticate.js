const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path based on your project structure

// Authentication middleware to verify JWT
const authenticate = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request object
        console.log(req.user); // Add this line to log user details for debugging
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};


module.exports = authenticate;
