//course routes
const express = require("express");
const Course = require("../models/Course");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Add a new course (Admin only)
router.post("/add", authenticate, async (req, res) => {
    const { name, universityId } = req.body;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const newCourse = new Course({ name, universityId });
        await newCourse.save();

        res.status(201).json({ message: "Class added successfully", Course : newCourse });
    } catch (error) {
        res.status(500).json({ message: "Error adding courses" });
    }
});

//get all courses for a university
router.get("/:universityId", async(req,res) => {
    const { universityId } = req.params;

    try {
        const Courses = await Course.find({universityId});
        res.status(200).json(Courses);

    } catch(error) {
        res.status(500).json({ message: "Error getting courses" });
    }
});

module.exports = router;
