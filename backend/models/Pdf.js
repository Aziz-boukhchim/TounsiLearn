const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    fileurl: { type: String, required: true }, // PDF file link
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    status: { type: String, enum: ["Pending", "Approved" , "Rejected"], default: "Pending" }, // Ensure correct case here
    upvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PDF", PdfSchema);
