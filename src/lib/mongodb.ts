import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/exam-preparation";

if (!MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local or .env");
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    // 1 = connected, 2 = connecting
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    throw error;
  }
}
