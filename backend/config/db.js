// Filepath: backend/config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MongoDB URL:", process.env.MONGO_URL); // Log untuk debugging
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Keluar jika koneksi gagal
  }
};

module.exports = connectDB;
