const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ SIGNUP
exports.signup = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    // ✅ CHECK EMPTY FIELDS
    if (!name || !email || !password) {

      return res.status(400).json({
        message: "All fields required"
      });
    }

    // ✅ CHECK USER EXISTS
    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ✅ CREATE USER
    const user = await User.create({

      name,

      email,

      password: hashedPassword,

      rating: 0,

      totalReviews: 0
    });

    res.status(201).json({
      message: "Signup successful ✅",
      user
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Signup failed ❌"
    });
  }
};

// ✅ CURRENT USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id name email rating totalReviews skillsOffered skillsWanted");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch profile" });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    // ✅ CHECK USER
    const user = await User.findOne({
      email
    });

    if (!user) {

      return res.status(400).json({
        message: "User not found ❌"
      });
    }

    // ✅ CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid credentials ❌"
      });
    }

    // ✅ GENERATE TOKEN
    console.log('Login generating JWT with secret length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    console.log('Login JWT secret preview:', process.env.JWT_SECRET ? process.env.JWT_SECRET.slice(0, 10) : null);
    const token = jwt.sign(

      {
        id: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );

    res.json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
        totalReviews: user.totalReviews
      }

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Login failed ❌"
    });
  }
};