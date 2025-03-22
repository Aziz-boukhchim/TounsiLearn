//pdf routes
const express = require("express");
const multer = require("multer");
const Pdf = require("../models/Pdf");
const University = require("../models/University");
const authenticate = require("../middleware/authenticate");
const Course = require("../models/Course");
const Year = require("../models/Year");
const Semester = require("../models/Semester");
const Branch = require("../models/Branch");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // folder where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// multer setup for file upload
const upload = multer({ storage });

// Upload a PDF -------------------------------------------------------------------------------------------
// Upload a PDF -------------------------------------------------------------------------------------------
router.post("/upload", authenticate, upload.single('pdfFile'), async (req, res) => {
    const { title, universityId, courseId, yearId, branchId, semesterId, description } = req.body;
    const pdfFilePath = req.file ? req.file.path : null; // Safeguard in case file is not uploaded
    
    if (!pdfFilePath) {
        return res.status(400).json({ message: "File upload failed or missing file" });
    }

    try {
        if (!universityId || !courseId || !yearId || !semesterId) {
            return res.status(400).json({ message: "University, Course, Year, and Semester IDs are required" });
        }

        // Check if the university exists
        const university = await University.findById(universityId);
        if (!university) {
            return res.status(400).json({ message: "University not found" });
        }

        // Check if the course exists and belongs to the specified university
        const course = await Course.findOne({ _id: courseId, universityId: university._id });
        if (!course) {
            return res.status(400).json({ message: "Course not found for this university" });
        }

        // Check if the year exists and belongs to the course
        const year = await Year.findOne({ _id: yearId, courseId: course._id });
        if (!year) {
            return res.status(400).json({ message: "Year not found for this course" });
        }

        // Check if the semester exists and belongs to the year
        const semester = await Semester.findOne({ _id: semesterId, yearId: year._id });
        if (!semester) {
            return res.status(400).json({ message: "Semester not found for this year" });
        }

        let branch = null;
        if (branchId) {
            branch = await Branch.findOne({ _id: branchId, yearId: year._id });
            if (!branch) {
                return res.status(400).json({ message: "Branch not found for this year" });
            }
        }

        // Create new PDF entry
        const newPdf = new Pdf({
            title,
            description,
            fileurl: pdfFilePath,
            university: university._id,
            course: course._id,
            year: year._id,
            semester: semester._id,
            branch: branch ? branch._id : null, // Only add branch if it's provided
            status: "Pending", // Initially marked as pending for approval
            uploadedBy: req.user.id, // The user who uploaded the PDF
        });

        await newPdf.save();
        res.status(201).json({ message: "PDF uploaded successfully", pdf: newPdf });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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

//get pdf for a course
router.get("/:universityId/:courseId", async(req,res) => {
    const {universityId , courseId } = req.params;

    try{

        const pdfs = await Pdf.find({university: universityId , course: courseId});
        res.status(200).json(pdfs);        

    }catch(error) {
        res.status(500).json({message : "server error"});
    }

});

//get pdfs per user
router.get("/userPdf", authenticate , async(req,res) => {
    try {

        if(!req.user || !req.user.id){
            return res.status(401).json({message : "Unauthorized"});
        }

        const pdfs = await Pdf.find({uploadedBy: req.user.id});
        res.status(200).json(pdfs);
    } catch(error) {
        res.status(500).json({message : "server error"})
    }
});

// Fetch PDFs based on university, course, year, branch, and semester
router.get("/search", async (req, res) => {
    const { universityId, courseId, yearId, branchId, semesterId } = req.query;

    const query = {};

    // Dynamically build the query based on provided query parameters
    if (universityId) query.university = universityId;
    if (courseId) query.course = courseId;
    if (yearId) query.year = yearId;

    // If it's not the first year, include the branchId in the query
    if (yearId !== "firstYearId" && branchId) {
        query.branch = branchId;
    }

    if (semesterId) query.semester = semesterId;

    try {
        // Find PDFs matching the constructed query
        const pdfs = await Pdf.find(query)
            .populate("university")
            .populate("course")
            .populate("year")
            .populate("branch")
            .populate("semester");

        if (pdfs.length === 0) {
            return res.status(404).json({ message: "No PDFs found matching the criteria" });
        }

        res.status(200).json(pdfs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching PDFs", error: error.message });
    }
});



module.exports = router;
