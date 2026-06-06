// console.log("🔥 skillRoutes loaded successfully");

const express = require("express");
const router = express.Router();

const skillController = require("../controllers/skillController");
console.log("skillController resolved:", require.resolve("../controllers/skillController"));

const auth = require("../middleware/authMiddleware");

const addSkill = skillController.addSkill;
const getSkills = skillController.getSkills;
const getMySkills = skillController.getMySkills;
const matchSkills = skillController.matchSkills;

console.log("skillController keys:", Object.keys(skillController));
console.log("skillController preview:", Object.fromEntries(Object.entries(skillController).slice(0,5)));

if (typeof getSkills !== "function") {
  throw new Error("skillController.getSkills is not a function");
}

if (typeof addSkill !== "function") {
  throw new Error("skillController.addSkill is not a function");
}

router.get("/", getSkills);
router.post("/", auth, addSkill);
router.get("/me", auth, getMySkills);
router.get("/match", auth, matchSkills);

module.exports = router;