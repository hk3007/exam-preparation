// pages/api/exams/[examId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Exam from "@/models/Exam";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { examId } = req.query;

    if (typeof examId !== "string") {
      return res.status(400).json({ error: "Invalid examId" });
    }

    await connectDB();

    const exam = await Exam.findOne({ name: examId }).lean();

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    return res.status(200).json(exam);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}