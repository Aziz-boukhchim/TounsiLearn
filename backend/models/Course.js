const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({

    name:{ type:String , required:true},
    universityId:{ type:mongoose.Schema.Types.ObjectId, ref:"University" , required:true },

});
module.exports = mongoose.model("Course" , CourseSchema);