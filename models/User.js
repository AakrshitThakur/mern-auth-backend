// Backend: backend/models/User.js
// -------------------------
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
