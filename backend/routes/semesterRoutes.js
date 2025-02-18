const express = require("express");
const Semester = require("../models/Semester");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Add a new semester (Admin only)
router.post("/add", authenticate, async (req, res) => {
    const { name, yearId } = req.body;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const newSemester = new Semester({ name, yearId });
        await newSemester.save();

        res.status(201).json({ message: "Semester added successfully", semester: newSemester });
    } catch (error) {
        res.status(500).json({ message: "Error adding semester" });
    }
});

// Get all semesters for a specific year
router.get("/:yearId", async (req, res) => {
    const { yearId } = req.params;

    try {
        const semesters = await Semester.find({ yearId });
        res.status(200).json(semesters);
    } catch (error) {
        res.status(500).json({ message: "Error fetching semesters" });
    }
});

module.exports = router;
