const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // 👤 Who sends request
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 Who receives request
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📌 Skills being swapped
    // Sender offers/teaches
    skillOfferedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    // Receiver's requested / what sender wants to learn
    skillRequestedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    // 🎯 Unique feature: what the sender wants to learn
    sessionGoal: {
      type: String,
      required: true,
      trim: true,
    },

    // 📌 Booking status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // ✅ Whether the session was completed
    completed: {
      type: Boolean,
      default: false,
    },

    // ✅ Whether the goal was completed
    goalCompleted: {
      type: Boolean,
      default: false,
    },

    // =====================
    // 📞 Meeting / contact
    // =====================
    contactEmail: {
      type: String,
      default: "",
      trim: true,
    },

    meetingDate: {

      type: Date,
      default: null,
    },

    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },
    meetingMessage: {
      type: String,
      default: "",
      trim: true,
    },

    // 📅 Session created date
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Booking", bookingSchema);

