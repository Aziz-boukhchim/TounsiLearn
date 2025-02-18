const express = require("express");
const Year = require("../models/Year");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Add a new year (Admin only)
router.post("/add", authenticate, async (req, res) => {
    const { name, courseId } = req.body;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const newYear = new Year({ name, courseId });
        await newYear.save();

        res.status(201).json({ message: "Year added successfully", year: newYear });
    } catch (error) {
        res.status(500).json({ message: "Error adding year" });
    }
});

// Get all years for a specific course
router.get("/:courseId", async (req, res) => {
    const { courseId } = req.params;

    try {
        const years = await Year.find({ courseId });
        res.status(200).json(years);
    } catch (error) {
        res.status(500).json({ message: "Error fetching years" });
    }
});

module.exports = router;
