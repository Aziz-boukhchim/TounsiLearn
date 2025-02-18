const mongoose = require("mongoose");

const BranchSchema = mongoose.Schema({

    name:{type: String , required: true}, // Example: "DSI", "SEM", "RSI"
    yearId:{type: mongoose.Schema.Types.ObjectId , ref:"Year", required:true}, // might add courseId

});
module.exports = mongoose.model("Branch", BranchSchema);