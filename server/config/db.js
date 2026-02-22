const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });


const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    console.log("No MONGO_URL set — skipping MongoDB connection");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Error: ${err.message}`);
    console.log("Continuing without MongoDB...");
  }
};

module.exports = connectDB;
