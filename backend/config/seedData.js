const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Skill = require("../models/Skill");

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // already has data
    }

    console.log("🌱 Database is empty. Seeding demo accounts and skills...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const alice = await User.create({
      name: "Alice Johnson",
      email: "alice@example.com",
      password: hashedPassword,
      rating: 4.8,
      totalReviews: 5,
    });

    const bob = await User.create({
      name: "Bob Smith",
      email: "bob@example.com",
      password: hashedPassword,
      rating: 4.9,
      totalReviews: 8,
    });

    const charlie = await User.create({
      name: "Charlie Brown",
      email: "charlie@example.com",
      password: hashedPassword,
      rating: 4.7,
      totalReviews: 3,
    });

    // Alice skills
    const aliceOffer = await Skill.create({
      title: "React & Web Development",
      description: "Learn modern React 19, hooks, component architecture, and state management.",
      type: "Web Development",
      postType: "offer",
      level: "Advanced",
      tags: ["React", "JavaScript", "Frontend", "Web Development"],
      user: alice._id,
      contactEmail: "alice@example.com",
    });

    const aliceRequest = await Skill.create({
      title: "UI/UX & Figma Design",
      description: "Want to learn Figma, design systems, and wireframing for web and mobile apps.",
      type: "Design",
      postType: "request",
      level: "Beginner",
      tags: ["UI/UX", "Design", "Figma"],
      user: alice._id,
      contactEmail: "alice@example.com",
    });

    // Bob skills
    const bobOffer = await Skill.create({
      title: "UI/UX & Figma Design",
      description: "Master UI/UX design, Figma prototypes, responsive design systems, and user testing.",
      type: "Design",
      postType: "offer",
      level: "Advanced",
      tags: ["UI/UX", "Design", "Figma"],
      user: bob._id,
      contactEmail: "bob@example.com",
    });

    const bobRequest = await Skill.create({
      title: "React & Web Development",
      description: "Looking for hands-on mentorship building interactive web apps using React.",
      type: "Web Development",
      postType: "request",
      level: "Beginner",
      tags: ["React", "JavaScript", "Frontend", "Web Development"],
      user: bob._id,
      contactEmail: "bob@example.com",
    });

    // Charlie skills
    const charlieOffer = await Skill.create({
      title: "Python for Data Science",
      description: "Hands-on data analysis, pandas, numpy, and machine learning fundamentals.",
      type: "Data Science",
      postType: "offer",
      level: "Intermediate",
      tags: ["Python", "Data Science", "Machine Learning"],
      user: charlie._id,
      contactEmail: "charlie@example.com",
    });

    const charlieRequest = await Skill.create({
      title: "React & Web Development",
      description: "Want to learn React to build data visualization dashboards.",
      type: "Web Development",
      postType: "request",
      level: "Beginner",
      tags: ["React", "Frontend"],
      user: charlie._id,
      contactEmail: "charlie@example.com",
    });

    // Link skills to users
    await User.findByIdAndUpdate(alice._id, {
      skillsOffered: [aliceOffer._id],
      skillsWanted: [aliceRequest._id],
    });

    await User.findByIdAndUpdate(bob._id, {
      skillsOffered: [bobOffer._id],
      skillsWanted: [bobRequest._id],
    });

    await User.findByIdAndUpdate(charlie._id, {
      skillsOffered: [charlieOffer._id],
      skillsWanted: [charlieRequest._id],
    });

    console.log("✅ Seed completed successfully! Demo accounts available:");
    console.log("   - alice@example.com / password123 (Offers React, Wants Figma)");
    console.log("   - bob@example.com / password123 (Offers Figma, Wants React - MUTUAL MATCH WITH ALICE)");
    console.log("   - charlie@example.com / password123 (Offers Python, Wants React)");
  } catch (err) {
    console.error("Seeding error:", err.message);
  }
};

module.exports = seedData;
