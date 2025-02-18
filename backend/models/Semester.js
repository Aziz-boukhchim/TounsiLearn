const mongoose = require("mongoose");

const SemesterSchema = mongoose.Schema({

    name:{type: String , required: true},  // Example: "1st Semester"
    yearId:{type: mongoose.Schema.Types.ObjectId, ref:"Year" , required:true},

});
module.exports = mongoose.model("Semester", SemesterSchema);