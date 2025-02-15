const mongoose = require("mongoose");
require ("dotenv").config();

const connectDB = async () => {
    try {
       const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Connected To Database : ${conn.connection.host}`);
    } catch(error) {
        console.error("Failed to connect" , error);
        process.exit(1);
    }
}

module.exports = connectDB;