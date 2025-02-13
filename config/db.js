const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/db_melodymentor");
        console.log("MongoDB Connected");
    } catch (e) {
        console.log("MongoDB not connected", e);
    }
};

module.exports = connectDb;
