//pdf routes
const express = require("express");
const Pdf = require("../models/Pdf");
const University = require("../models/University");
const authenticate = require("../middleware/authenticate");
const Course = require("../models/Course");
const Year = require("../models/Year");
const Semester = require("../models/Semester");
const Branch = require("../models/Branch");

const router = express.Router();

require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");


//configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//setup cloudinary storage for PDFs
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pdfs", // The folder name in Cloudinary
        format: async(req,file) => "pdf",
        public_id: (req,file) => Date.now() + "-" + file.originalname,
    },
});


// multer setup for file upload
const upload = multer({ storage });

// Upload a PDF -------------------------------------------------------------------------------------------
router.post("/upload", authenticate, upload.single("pdfFile"), async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "File upload failed or missing file" });
        }

        const { title, universityId, courseId, yearId, branchId, semesterId, description } = req.body;

        // Validate required fields
        if (!universityId || !courseId || !yearId || !semesterId) {
            return res.status(400).json({ message: "University, Course, Year, and Semester IDs are required" });
        }

        // Check if the university exists
        const university = await University.findById(universityId);
        if (!university) return res.status(400).json({ message: "University not found" });

        // Check if the course exists and belongs to the university
        const course = await Course.findOne({ _id: courseId, universityId });
        if (!course) return res.status(400).json({ message: "Course not found for this university" });

        // Check if the year exists and belongs to the course
        const year = await Year.findOne({ _id: yearId, courseId });
        if (!year) return res.status(400).json({ message: "Year not found for this course" });

        // Check if the semester exists and belongs to the year
        const semester = await Semester.findOne({ _id: semesterId, yearId });
        if (!semester) return res.status(400).json({ message: "Semester not found for this year" });

        let branch = null;
        if (branchId) {
            branch = await Branch.findOne({ _id: branchId, yearId });
            if (!branch) return res.status(400).json({ message: "Branch not found for this year" });
        }

        // Upload to Cloudinary as a RAW PDF file
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "pdfs",
            resource_type: "raw", // Raw file (PDF)
            public_id: Date.now() + "-" + req.file.originalname,
            format: "pdf",
        });

        // Save the file URL from Cloudinary
        const newPdf = new Pdf({
            title,
            description,
            fileurl: cloudinaryResponse.secure_url, // Correct Cloudinary file URL
            university: universityId,
            course: courseId,
            year: yearId,
            semester: semesterId,
            branch: branchId || null,
            status: "Pending",
            uploadedBy: req.user.id,
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
