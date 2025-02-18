const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    fileurl: { type: String, required: true }, // PDF file link
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    year: { type: mongoose.Schema.Types.ObjectId, ref: "Year", required: true },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: false }, // Optional (only for 2nd/3rd year)
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, 
    upvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PDF", PdfSchema);
