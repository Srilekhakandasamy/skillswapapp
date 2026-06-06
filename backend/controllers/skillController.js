const Skill = require("../models/Skill");
const User = require("../models/User");

// Add a new skill
exports.addSkill = async (req, res) => {
  try {
    const { title, description, type } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const userId = req.user.id;

    const { postType, level, tags, contactEmail } = req.body;

    const skill = await Skill.create({
      title,
      description,
      type: type || "General",
      postType: postType || "offer",
      level: level || "Beginner",
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.length ? tags.split(',').map(t=>t.trim()) : []),
      contactEmail: contactEmail || "",
      user: userId,
    });


    // add to user's offered/wanted lists
    if (skill.postType === 'offer') {
      await User.findByIdAndUpdate(userId, { $push: { skillsOffered: skill._id } });
    } else {
      await User.findByIdAndUpdate(userId, { $push: { skillsWanted: skill._id } });
    }

    return res.status(201).json({ message: "Skill added successfully", skill });
  } catch (err) {
    console.error("Add Skill Error:", err);
    return res.status(500).json({ message: "Error adding skill" });
  }
};

// Get all skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate("user", "name email rating totalReviews")
      .sort({ createdAt: -1 });

    return res.json(skills);
  } catch (err) {
    console.error("Get Skills Error:", err);
    return res.status(500).json({ message: "Error fetching skills" });
  }
};

// Get skills for the logged-in user
exports.getMySkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const mySkills = await Skill.find({ user: userId }).sort({ createdAt: -1 });
    return res.json(mySkills);
  } catch (err) {
    console.error("My Skills Error:", err);
    return res.status(500).json({ message: "Error fetching user skills" });
  }
};

// Mutual matching: user A matches user B if
// A offers something B requests AND B offers something A requests
exports.matchSkills = async (req, res) => {
  try {
    const userId = req.user.id;

    const myOffers = await Skill.find({ user: userId, postType: 'offer' });
    const myRequests = await Skill.find({ user: userId, postType: 'request' });

    const offerTitles = myOffers.map(s => s.title.toLowerCase());
    const offerTags = myOffers.flatMap(s => s.tags || []);

    const requestTitles = myRequests.map(s => s.title.toLowerCase());
    const requestTags = myRequests.flatMap(s => s.tags || []);

    // users who want my offers
    const usersWhoWantMyOffers = await Skill.find({
      postType: 'request',
      user: { $ne: userId },
      $or: [
        { title: { $in: offerTitles } },
        { tags: { $in: offerTags } }
      ]
    }).distinct('user');

    // users who offer what I want
    const usersWhoOfferMyRequests = await Skill.find({
      postType: 'offer',
      user: { $ne: userId },
      $or: [
        { title: { $in: requestTitles } },
        { tags: { $in: requestTags } }
      ]
    }).distinct('user');

    // intersection
    const mutualUserIds = usersWhoWantMyOffers.filter(u => usersWhoOfferMyRequests.includes(u.toString()));

    const users = await User.find({ _id: { $in: mutualUserIds } }).select('name email rating totalReviews');

    return res.json(users);
  } catch (err) {
    console.error('Match Error:', err);
    return res.status(500).json({ message: 'Error finding matches' });
  }
};