const express = require("express");
const Branch = require("../models/Branch");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Add a new branch (Admin only)
router.post("/add", authenticate, async (req, res) => {
    const { name, yearId } = req.body;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const newBranch = new Branch({ name, yearId });
        await newBranch.save();

        res.status(201).json({ message: "Branch added successfully", branch: newBranch });
    } catch (error) {
        res.status(500).json({ message: "Error adding branch" });
    }
});

// Get all branches for a specific year
router.get("/:yearId", async (req, res) => {
    const { yearId } = req.params;

    try {
        const branches = await Branch.find({ yearId });
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching branches" });
    }
});

module.exports = router;
