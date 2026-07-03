const mongoose = require("mongoose");

const connectDB = async () => {

    const uri = process.env.MONGODB_URI;

    // Demo Mode
    if (!uri || uri.includes("your_mongodb_uri")) {

        console.warn("====================================");
        console.warn(" MongoDB URI not configured");
        console.warn(" Running in DEMO MODE");
        console.warn("====================================");

        return null;
    }

    try {

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("====================================");
        console.log(" MongoDB Connected");
        console.log(` Host : ${conn.connection.host}`);
        console.log(` Database : ${conn.connection.name}`);
        console.log("====================================");

        return conn;

    } catch (err) {

        console.error("====================================");
        console.error(" MongoDB Connection Failed");
        console.error(err.message);
        console.error(" Starting in Demo Mode");
        console.error("====================================");

        return null;
    }

};

module.exports = connectDB;