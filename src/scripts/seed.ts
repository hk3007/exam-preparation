// scripts/seed.ts
import "dotenv/config";
import { connectDB } from "../lib/mongodb";
import Exam from "../models/Exam";

async function seed() {
  await connectDB();

  // Example data
  const exam = {
    name: "UPSC",
    subjects: [
      "History",
      "Geography",
      "Polity",
      "Economics"
    ],
    description: "Union Public Service Commission examination",
    upcomingDate: "2025-06-01"
  };

  await Exam.deleteMany({});
  await Exam.create(exam);

  console.log("✅ Database seeded successfully");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error seeding:", err);
  process.exit(1);
});
