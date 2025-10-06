// src/pages/api/exam.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Exam from "@/models/Exam";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const exams = await Exam.find({}).lean();
      return res.status(200).json({ exams });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch exams" });
    }
  }

  if (req.method === "POST") {
    try {
      const newExam = await Exam.create(req.body);
      return res.status(201).json({ success: true, exam: newExam });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) return res.status(400).json({ success: false, error: err.message });
      return res.status(500).json({ success: false, error: "Unknown error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
