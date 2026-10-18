const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = "mongodb://127.0.0.1:27017/skillswap";

  // 1. Try primary URI if provided (with quick timeout)
  if (primaryUri && !primaryUri.includes("127.0.0.1") && !primaryUri.includes("localhost")) {
    try {
      console.log("Attempting connection to configured MONGO_URI...");
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
      console.log("MongoDB Connected to Remote URI ✅");
      return conn;
    } catch (err) {
      console.warn("Remote MongoDB connection failed (" + err.message + "). Falling back...");
    }
  }

  // 2. Try local MongoDB on port 27017
  try {
    console.log("Attempting connection to local MongoDB at", localUri);
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log("MongoDB Connected to local MongoDB (port 27017) ✅");
    return conn;
  } catch (err) {
    console.warn("Local MongoDB on port 27017 not available (" + err.message + ")");
  }

  // 3. Fallback to MongoMemoryServer
  try {
    console.log("🚀 Starting embedded In-Memory MongoDB Server for local development...");
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "skillswap",
      },
    });
    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log("MongoDB Connected to In-Memory MongoDB instance ✅");
    return conn;
  } catch (err) {
    console.error("❌ Failed to start in-memory MongoDB fallback:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;