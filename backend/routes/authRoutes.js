//authentication routes user login/register
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
require('dotenv').config(); // Make sure to require dotenv for environment variables

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        //  Include role in the token payload
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/name", authenticate ,async(req,res) => {
    const { name } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true }
        );

    if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

    res.json({message: "Name updated successfully", user:updatedUser});

    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ message: "Server error" });
    }
});











module.exports = router;
