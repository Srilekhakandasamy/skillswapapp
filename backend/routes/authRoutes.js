const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =======================
// 🔐 AUTH ROUTES
// =======================

// ➕ Signup
router.post("/signup", signup);

// 🔑 Login
router.post("/login", login);

// 🔐 Get current authenticated user
router.get("/me", auth, getProfile);

// =======================
// 🔎 TOKEN VERIFY (temporary)
// =======================
router.post("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.body.token || req.query.token;
    if (!authHeader) return res.status(400).json({ message: "No token provided" });

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    console.log("Verify route authHeader:", authHeader);
    console.log("Verify route token length:", token.length);
    console.log("Verify route token preview:", token.slice(0, 20), "...", token.slice(-20));
    console.log("Verify route decoded payload:", jwt.decode(token));
    console.log('Verify route secret length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    console.log('Verify route secret preview:', process.env.JWT_SECRET ? process.env.JWT_SECRET.slice(0, 10) : null);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not set on server" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id name email");

    return res.json({ valid: true, user });
  } catch (err) {
    console.log("Token verify error:", err.message);
    console.log(err);
    return res.status(401).json({ valid: false, message: err.message });
  }
});

module.exports = router;