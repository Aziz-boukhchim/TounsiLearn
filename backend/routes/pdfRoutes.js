const express = require("express");
const multer = require("multer");
const Pdf = require("../models/Pdf");
const University = require("../models/University");
const authenticate = require("../middleware/authenticate");

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
router.post("/upload", authenticate, upload.single('pdfFile'), async (req, res) => {

    const { title, UniversityId, description } = req.body;
    const pdfFilePath = req.file ? req.file.path : null; // Safeguard in case file is not uploaded
    
    if (!pdfFilePath) {
        return res.status(400).json({ message: "File upload failed or missing file" });
    }

    try {
        if (!UniversityId) {
            return res.status(400).json({ message: "University ID is required" });
        }

        const university = await University.findById(UniversityId);
        if (!university) {
            return res.status(400).json({ message: "University not found" });
        }

        const newPdf = new Pdf({
            title,
            description,
            fileurl: pdfFilePath,
            university: university._id,
            status: "Pending",
            uploadedBy: req.user.id, // Now this should work since req.user is populated
        });

        await newPdf.save();
        res.status(201).json({ message: "PDF uploaded successfully", pdf: newPdf });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
