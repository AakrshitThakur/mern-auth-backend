import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mern-auth";
export default mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));