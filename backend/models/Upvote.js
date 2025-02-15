const mongoose = require("mongoose");

const UpvoteSchema = new mongoose.Schema({

    pdfId:{type:mongoose.Schema.Types.ObjectId, ref:"PDF" , required:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"PDF" , required:true},
    
});
module.exports = mongoose.model("Upvote" , UpvoteSchema);