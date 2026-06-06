const Review = require("../models/Review");
const User = require("../models/User");
const Booking = require("../models/Booking");

// =======================
// ⭐ ADD REVIEW (by booking, between users)
// =======================
exports.addReview = async (req, res) => {
  try {
    const { bookingId, toUserId, rating, comment } = req.body;

    if (!bookingId || !toUserId || !rating) {
      return res.status(400).json({ message: "bookingId, toUserId, and rating are required" });
    }

    const fromUserId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!booking.completed) {
      return res.status(403).json({ message: "You can only review after a completed session" });
    }

    const senderId = booking.senderId.toString();
    const receiverId = booking.receiverId.toString();

    if (![senderId, receiverId].includes(fromUserId)) {
      return res.status(403).json({ message: "You are not a participant of this booking" });
    }

    if (![senderId, receiverId].includes(toUserId) || toUserId === fromUserId) {
      return res.status(403).json({ message: "toUserId must be the other participant" });
    }

    // Enforce single review per booking per reviewer
    const existing = await Review.findOne({ booking: bookingId, fromUser: fromUserId });
    if (existing) {
      return res.status(409).json({ message: "You already reviewed this session" });
    }

    const review = await Review.create({
      booking: bookingId,
      fromUser: fromUserId,
      toUser: toUserId,
      rating,
      comment: comment || "",
    });

    // Recalculate aggregated rating for the user being reviewed
    const receivedReviews = await Review.find({ toUser: toUserId });
    const totalRatings = receivedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = receivedReviews.length ? totalRatings / receivedReviews.length : 0;

    await User.findByIdAndUpdate(toUserId, {
      rating: avgRating,
      totalReviews: receivedReviews.length,
    });

    return res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    console.log("Add Review Error:", err);
    return res.status(500).json({ message: "Error adding review" });
  }
};

// =======================
// 📥 GET REVIEWS BETWEEN USERS (optional)
// =======================
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ toUser: userId })
      .populate("fromUser", "name email")
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.log("User Reviews Error:", err);
    return res.status(500).json({ message: "Error fetching user reviews" });
  }
};
