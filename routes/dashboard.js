// Backend: backend/routes/dashboard.js
import express from "express";
import User from "../models/User.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

// Login
router.get("/dashboard", checkAuth, async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) return res.status(400).json({ msg: "No user found" });
    res.status(200).json({
      users: users.map((user) => ({
        username: user.username,
        dob: new Date(user.dob).toLocaleString().split(",")[0],
        joiningDate: new Date(user.createdAt).toISOString().split("T")[0],
        email: user.email,
        role: user.role,
      })),
      msg: "All user records retrieved successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: error.message });
  }
});

export default router;
