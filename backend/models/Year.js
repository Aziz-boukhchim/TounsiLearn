const mongoose = require("mongoose");

const YearSchema = mongoose.Schema({

    name:{type: String , required:true}, // Example: "1st Year"
    courseId: {type: mongoose.Schema.Types.ObjectId , ref:"Course" , required:true},

});
module.exports = mongoose.model("Year", YearSchema);