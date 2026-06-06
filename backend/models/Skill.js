const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    // 📌 Skill title (e.g., "React", "Python", "UI Design")
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 📝 Skill description
    description: {
      type: String,
      required: true,
    },

    // 🏷️ Skill type (optional categorization)
    // Category or subject of the skill (e.g., Backend, Design)
    type: {
      type: String,
      default: "General",
    },

    // Post type: offer (teach) or request (want to learn)
    postType: {
      type: String,
      enum: ["offer", "request"],
      default: "offer",
    },

    // Skill level
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // Tags for matching
    tags: {
      type: [String],
      default: [],
    },

    // 👤 Owner of the skill
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📧 Contact email for sharing / meeting
    contactEmail: {
      type: String,
      default: "",
      trim: true,
    },

  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Skill", skillSchema);