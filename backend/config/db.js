const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = "mongodb://127.0.0.1:27017/skillswap";

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log("MongoDB Connected ✅");
    return conn;
  } catch (err) {
    console.error("DB Connection Error ❌", err.message);

    if (primaryUri && !primaryUri.includes("127.0.0.1") && !primaryUri.includes("localhost")) {
      console.warn("Attempting fallback to local MongoDB at", fallbackUri);
      try {
        const conn = await mongoose.connect(fallbackUri);
        console.log("MongoDB Connected to local fallback ✅");
        return conn;
      } catch (fallbackErr) {
        console.error("Local MongoDB fallback failed ❌", fallbackErr.message);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;