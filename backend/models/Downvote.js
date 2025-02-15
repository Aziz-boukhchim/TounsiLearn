const mongoose = require("mongoose");

const DownvoteSchema = mongoose.Schema({
    
    pdfId:{type:mongoose.Schema.Types.ObjectId, ref:"PDF" , required:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"PDF", required:true},

});
module.exports = mongoose.model("Downvote" , DownvoteSchema);