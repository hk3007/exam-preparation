import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Question from "@/models/Question";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    const { slug, type } = req.query;

    if (!slug || !type || Array.isArray(slug) || Array.isArray(type)) {
      return res.status(400).json({ message: "Invalid slug or type" });
    }

    const questions = await Question.find({ topicSlug: slug, type })
      .sort({ year: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({ data: questions });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
