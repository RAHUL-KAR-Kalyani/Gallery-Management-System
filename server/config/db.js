const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.time("MongoDB Connection");
        await mongoose.connect(process.env.MONGO_URI);
        console.timeEnd("MongoDB Connection");
        console.log('Connection to MongoDB established!');
    } catch (error) {
        // console.log(error);
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;