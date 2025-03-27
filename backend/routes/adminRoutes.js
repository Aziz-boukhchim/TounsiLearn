//admin routes
const express = require("express");
const Pdf = require("../models/Pdf");
const University = require("../models/University");
const Course = require("../models/Course");
const Year = require("../models/Year");
const Branch = require("../models/Branch");
const Semester = require("../models/Semester");
const authenticate = require("../middleware/authenticate");


const router = express.Router();


//add a new university -------------------------------------------------------------
router.post('/add-university', authenticate ,async (req, res) => {
    const { name } = req.body;

    try {
        const newUniversity = new University({
            name,
        });

        if(req.user.role !== "admin") {
            res.status(403).json({message: "Access denied"});
        }

        await newUniversity.save();

        res.status(201).json({
            message: "University added successfully",
            university: newUniversity
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding university" });
    }
});

//Approve PDF Route----------------------------------------------------------------------------
router.patch("/pdf/approve/:pdfId", authenticate, async (req, res) => {
    const { pdfId } = req.params;

    try {
        const pdf = await Pdf.findById(pdfId);
        if (!pdf) return res.status(404).json({ message: "PDF not found" });

        // Check if the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        pdf.status = "Approved";
        await pdf.save();

        res.status(200).json({
            message: "PDF approved successfully",
            pdf
        });
    } catch (error) {
        res.status(500).json({ message: "Error approving PDF" });
    }
});

//Reject PDF Route------------------------------------------------------------------------------------
router.patch("/pdf/reject/:pdfId", authenticate , async(req,res) => {
    const { pdfId } = req.params;

    try {
        const pdf = await Pdf.findById(pdfId);
        if(!pdf) return res.status(404).json({message: "PDF Not Found"});

        if (req.user.role !== "admin") {
            return res.status(403).json({message: "Access denied. Admins only."});
        }

        pdf.status = "Rejected";
        await pdf.save();

        res.status(200).json({
            message: "PDF is rejected",
            pdf
        })
    } catch(error) {
        res.status(500).json({message: "Error rejecting PDF"})
    }
});

// Add a new course (Admin only) ------------------------------------------------------------------------------------
router.post("/add-course", authenticate, async (req, res) => {
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

// Add a new year (Admin only) ------------------------------------------------------------------------------------
router.post("/add-year", authenticate, async (req, res) => {
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


// Add a new branch (Admin only) ------------------------------------------------------------------------------------
router.post("/add-branch", authenticate, async (req, res) => {
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

// Add a new semester (Admin only) ------------------------------------------------------------------------------------
router.post("/add-semester", authenticate, async (req, res) => {
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

// get all pdfs
router.get("/pdfs", async(req,res) => {
    
    try {
        const pdfs = await Pdf.find().populate("university").populate("uploadedBy");
        res.status(200).json(pdfs);
    } catch(error) {
        res.status(500).json({message: "server error"})
    }
});

//get all universities ------------------------------------------------------------------------------------
router.get("/universities", async (req, res) => {
    try {
        // Fetch all universities from the database
        const universities = await University.find();

        // If no universities are found, return a 404 response
        if (universities.length === 0) {
            return res.status(404).json({ message: "No universities found" });
        }

        // Send the universities as a response
        res.status(200).json(universities);
    } catch (error) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: "Error fetching universities", error: error.message });
    }
});


//get all courses for a university ------------------------------------------------------------------------------------
router.get("/courses/:universityId", async(req,res) => {
    const { universityId } = req.params;

    res.set("Cache-Control", "no-store"); // Prevent caching

    try {
        const Courses = await Course.find({universityId});
        res.status(200).json(Courses);

    } catch(error) {
        res.status(500).json({ message: "Error getting courses" });
    }
});


// Get all years for a specific course ------------------------------------------------------------------------------------
router.get("/years/:courseId", async (req, res) => {
    const { courseId } = req.params;

    try {
        const years = await Year.find({ courseId });
        res.status(200).json(years);
    } catch (error) {
        res.status(500).json({ message: "Error fetching years" });
    }
});


// Get all branches for a specific year ------------------------------------------------------------------------------------
router.get("/branches/:yearId", async (req, res) => {
    const { yearId } = req.params;

    try {
        const branches = await Branch.find({ yearId });
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching branches" });
    }
});


// Get all semesters for a specific year ------------------------------------------------------------------------------------
router.get("/semesters/:yearId", async (req, res) => {
    const { yearId } = req.params;

    try {
        const semesters = await Semester.find({ yearId });
        res.status(200).json(semesters);
    } catch (error) {
        res.status(500).json({ message: "Error fetching semesters" });
    }
});




module.exports = router;