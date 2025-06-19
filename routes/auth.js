// Backend: backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Registration
router.post("/register", async (req, res) => {
  if (
    !req.body ||
    !req.body.username ||
    !req.body.dob ||
    !req.body.email ||
    !req.body.password
  ) {
    return res
      .status(400)
      .json({ msg: "ERROR! Please provide all the credentials" });
  }
  const { username, dob, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    let role;
    if (username == "admin" && process.env.ADMIN_PASSWORD == password) {
      role = "admin";
    } else role = "user";

    user = new User({ username, dob, role, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log(await user.save());

    const payload = {
      userId: user._id,
      userName: user.username,
      userEmail: user.email,
      userDob: user.dob,
      userRole: user.role,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "mern-auth-backend",
      {
        expiresIn: "6h",
      }
    );
    res
      .status(200)
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
        httpOnly: true, // prevents client-side JS from reading the cookie
        secure: true,
        sameSite: "None",
      })
      .json({
        msg: "User successfully created",
        user: payload,
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "ERROR! Please provide all the credentials" });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = {
      userId: user._id,
      userName: user.username,
      userDob: user.dob,
      userRole: user.role,
      userEmail: user.email,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "mern-auth-backend",
      {
        expiresIn: "6h",
      }
    );
    res
      .status(200)
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        user: payload,
        msg: `${user.username ? user.username : "User"} successfully logged in`,
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: error.message });
  }
});

router.get("/logout", (req, res) => {
  res
    .clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .status(200)
    .json({ msg: "Logged out successfully" });
});

export default router;
