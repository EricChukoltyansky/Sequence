const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const URL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(URL);
        console.log('Mongo db connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;