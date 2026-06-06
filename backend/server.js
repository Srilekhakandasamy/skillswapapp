const express = require("express");
const cors = require("cors");

require("dotenv").config({ path: "./.env" });

const connectDB = require("./config/db");

const app = express();

console.log("✅ Server file loaded");


// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());


// ✅ ROUTES
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/skills",
  require("./routes/skillRoutes")
);

app.use(
  "/api/bookings",
  require("./routes/bookingRoutes")
);

// ⭐ REVIEWS ROUTE
app.use(
  "/api/reviews",
  require("./routes/reviewRoutes")
);


// ✅ HOME ROUTE
app.get("/", (req, res) => {

  res.send("Backend + DB working 🚀");

});


// ✅ TEST ROUTE
app.post("/test", (req, res) => {

  console.log("🔥 TEST ROUTE HIT");

  res.send("Test working");

});


// ✅ CONNECT DATABASE & START SERVER
const startServer = async () => {

  try {

    await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

  } catch (err) {

    console.error(
      "❌ Server start error:",
      err
    );
  }
};

startServer();