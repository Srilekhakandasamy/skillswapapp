const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Reference to the completed booking/session
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    // Who gives the review
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Who receives the review
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⭐ Rating 1–5
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // 💬 Optional comment
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews for same session by same reviewer
reviewSchema.index({ booking: 1, fromUser: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);

