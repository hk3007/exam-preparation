// pages/api/questions/[slug]/[type].ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Question from "@/models/Question";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  res.setHeader("Cache-Control", "no-store"); // prevent caching 304

  const { slug, type } = req.query;

  // Validate
  if (!slug || !type || Array.isArray(slug) || Array.isArray(type)) {
    return res.status(400).json({ error: "Invalid slug or type" });
  }

  try {
    // Use slug exactly as stored in DB
    const questions = await Question.find({ topicSlug: slug, type }).lean();
    return res.status(200).json({ data: questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
