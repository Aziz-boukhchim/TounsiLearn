//comment routes
const express = require("express");
const Comment = require("../models/Comment");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

//Add a Comment ----------------------------------------------------------------
router.post("/comment" , authenticate ,async(req,res) => {
    const { pdfId , text } = req.body;

    try {
        const newComment = new Comment({
            pdfId,
            userId : req.user.id, // Assuming user authentication is done
            text,
        });
        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });

         } catch ( error) {
            res.status(500).json({ message: "Server error" });
        }
});


//Get Comments for a PDF----------------------------------------------------------------
router.get("/comment/:pdfId" , async(req,res) => {
    const { pdfId } = req.params;

    try {
        const comments = await Comment.find({pdfId}).populate("userId");
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    } 
});

module.exports = router;
