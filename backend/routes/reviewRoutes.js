console.log("🔥 reviewRoutes loaded");

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const { addReview, getUserReviews } = require("../controllers/reviewController");

// =======================
// ⭐ ADD REVIEW
// =======================
router.post("/", auth, addReview);

// =======================
// 📥 GET REVIEWS YOU RECEIVED (optional dashboard)
// =======================
router.get("/user/me", auth, getUserReviews);

module.exports = router;
