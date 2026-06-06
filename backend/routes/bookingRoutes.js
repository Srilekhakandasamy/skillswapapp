console.log("🔥 bookingRoutes loaded");

const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");

// =======================
// ➕ CREATE BOOKING
// =======================
router.post("/", auth, async (req, res) => {
  try {
    const { receiverId, skillOfferedId, skillRequestedId, sessionGoal } = req.body;

    if (!receiverId || !skillOfferedId || !skillRequestedId || !sessionGoal) {
      return res.status(400).json({ message: "receiverId, skillOfferedId, skillRequestedId, and sessionGoal are required" });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: "You cannot send a booking to yourself" });
    }

    const Skill = require("../models/Skill");
    const offeredSkill = await Skill.findById(skillOfferedId);

    const booking = new Booking({

      senderId: req.user.id,
      receiverId,
      skillOfferedId,
      skillRequestedId,
      sessionGoal,
      status: "pending",
      contactEmail: offeredSkill?.contactEmail || "",

    });


    await booking.save();

    res.status(201).json({
      message: "Request sent successfully",
      booking,
    });
  } catch (err) {
    console.log("Create Booking Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 📥 GET MY BOOKINGS
// =======================
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { senderId: req.user.id },
        { receiverId: req.user.id },
      ],
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .populate("skillOfferedId", "title level postType tags user")
      .populate("skillRequestedId", "title level postType tags user")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log("Fetch Booking Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 📥 GET COMPLETED BOOKINGS
// =======================
router.get("/completed", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      completed: true,
      $or: [
        { senderId: req.user.id },
        { receiverId: req.user.id },
      ],
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .populate("skillOfferedId", "title level postType tags user")
      .populate("skillRequestedId", "title level postType tags user")
      .sort({ updatedAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log("Fetch Completed Bookings Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// ✏️ ACCEPT / REJECT BOOKING
// =======================
router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Legacy fallback support (older docs may use sender/receiver instead of senderId/receiverId)
    const receiverId = booking.receiverId || booking.receiver;
    const senderId = booking.senderId || booking.sender;

    if (!receiverId) {
      console.log("[booking PUT] Missing receiverId/receiver", {
        bookingId: req.params.id,
        receiverId: booking.receiverId,
        receiver: booking.receiver,
        reqUserId: req.user.id,
      });
      return res.status(400).json({ message: "Booking receiver not found" });
    }

    console.log("[booking PUT] accept/reject", {
      bookingId: req.params.id,
      reqUserId: req.user.id,
      receiverId: receiverId?.toString?.() || receiverId,
      senderId: senderId?.toString?.() || senderId,
      status,
    });

    if (receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the receiver can update this booking" });
    }

    booking.status = status;
    await booking.save();


    await booking.populate("senderId", "name email").populate("receiverId", "name email");

    res.json({ message: "Booking updated", booking });
  } catch (err) {
    console.log("Update Booking Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// ✅ MARK SESSION COMPLETED
// =======================
router.put("/:id/complete", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only participants can mark completed
    if (booking.receiverId.toString() !== req.user.id && booking.senderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only participants can mark completion" });
    }

    booking.completed = true;

    // allow frontend to optionally submit goalCompleted later, default false
    if (typeof req.body.goalCompleted === "boolean") {
      booking.goalCompleted = req.body.goalCompleted;
    }

    await booking.save();

    await booking.populate("senderId", "name email").populate("receiverId", "name email");

    res.json({ message: "Session marked completed", booking });
  } catch (err) {
    console.log("Complete Booking Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 📞 SAVE MEETING DETAILS (sender only)
// =======================
router.put("/:id/meeting", auth, async (req, res) => {
  try {
    const { meetingDate, meetingLink, meetingMessage } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "accepted") {
      return res.status(400).json({ message: "Meeting details can be saved only after acceptance" });
    }

    // sender-only per your decision
    if (booking.senderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the sender can set meeting details" });
    }

    // Update fields if provided
    if (meetingDate !== undefined) booking.meetingDate = meetingDate;
    if (meetingLink !== undefined) booking.meetingLink = meetingLink;
    if (meetingMessage !== undefined) booking.meetingMessage = meetingMessage;

    await booking.save();

    await booking.populate("senderId", "name email").populate("receiverId", "name email");

    res.json({ message: "Meeting details saved", booking });
  } catch (err) {
    console.log("Save meeting error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


