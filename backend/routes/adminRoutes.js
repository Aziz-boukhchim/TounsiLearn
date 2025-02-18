//admin routes
const express = require("express");
const Pdf = require("../models/Pdf");
const University = require("../models/University");
const authenticate = require("../middleware/authenticate");


const router = express.Router();

// get all pdfs
router.get("/pdfs", async(req,res) => {
    
    try {
        const pdfs = await Pdf.find().populate("university").populate("uploadedBy");
        res.status(200).json(pdfs);
    } catch(error) {
        res.status(500).json({message: "server error"})
    }
});

// Route to add a new university -------------------------------------------------------------
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
        console.error(error);
        res.status(500).json({ message: "Error approving PDF" });
    }
});

//Reject PDF Route------------------------------------------------------------------------------------
router.patch("/pdf/reject/:pdfId", authenticate , async(req,res) => {
    const { pdfId } = req.params;

    try {
        const pdf = await Pdf.findById({pdfId});
        if(!pdf) return res.status(404).json({message: "PDF Not Found"});

        if (req.user.role !== "admin") {
            return res.status(403).json({message: "Access denied. Admins only."});
        }

        pdf.status = "Rejected";
        await pdf.save();

        res.status(200).json({
            message: "PDF is rejected", pdf
        })
    } catch(error) {
        res.status(500).json({message: "Error rejecting PDF"})
    }
});

module.exports = router;