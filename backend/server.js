const express = require("express");
const connectDB = require("./config/db")
const dotenv = require("dotenv");
// Import Routes
const userRoutes = require("./routes/authRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const upvoteRoutes = require("./routes/upvoteRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes");



dotenv.config();
connectDB();


const app = express();

app.use(express.json()); // Middleware to parse JSON requests

app.get("/" , (req , res) => {
    res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/upvotes", upvoteRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});