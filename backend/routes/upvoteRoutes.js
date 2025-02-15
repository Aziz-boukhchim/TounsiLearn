const express = require("express");
const Upvote = require("../models/Upvote");
const Pdf = require("../models/Pdf");
const authenticate = require("../middleware/authenticate");
const Downvote = require("../models/Downvote");

const router = express.Router();


//Upvote a PDF --------------------------------------------------------------------------------------
router.post("/upvote", authenticate, async (req, res) => {
    const { pdfId } = req.body;

    try {
        // Remove any existing downvote from the user
        await Downvote.deleteOne({ pdfId, userId: req.user.id });

        // Check if the user already upvoted
        const existingUpvote = await Upvote.findOne({ pdfId, userId: req.user.id });

        if (existingUpvote) {
            // If user already upvoted, remove the upvote (toggle off)
            await existingUpvote.deleteOne();
            await Pdf.findByIdAndUpdate(pdfId, { $inc: { upvotes: -1 } });
            return res.status(200).json({ message: "Upvote removed", pdfId });
        } else {
            // Otherwise, add a new upvote
            const newUpvote = new Upvote({ pdfId, userId: req.user.id });
            await newUpvote.save();
            await Pdf.findByIdAndUpdate(pdfId, { $inc: { upvotes: 1 } });
            return res.status(201).json({ message: "Upvoted successfully", pdfId });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//deUpvote---------------------------------------------------------------------
router.post("/downvote", authenticate, async (req, res) => {
    const { pdfId } = req.body;

    try {
        // Remove any existing upvote from the user
        await Upvote.deleteOne({ pdfId, userId: req.user.id });

        // Check if the user already downvoted
        const existingDownvote = await Downvote.findOne({ pdfId, userId: req.user.id });

        if (existingDownvote) {
            // If user already downvoted, remove the downvote (toggle off)
            await existingDownvote.deleteOne();
            await Pdf.findByIdAndUpdate(pdfId, { $inc: { upvotes: 1 } });
            return res.status(200).json({ message: "Downvote removed", pdfId });
        } else {
            // Otherwise, add a new downvote
            const newDownvote = new Downvote({ pdfId, userId: req.user.id });
            await newDownvote.save();
            await Pdf.findByIdAndUpdate(pdfId, { $inc: { upvotes: -1 } });
            return res.status(201).json({ message: "Downvoted successfully", pdfId });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


//Get Upvote Count for a PDF -------------------------------------------------------------------------
router.get("/upvotes/:pdfId" , async(req,res) => {
    const { pdfId } = req.params;

    try {
        const pdf = await Pdf.findById(pdfId);
        res.status(200).json({ upvotes : pdf.upvotes });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
