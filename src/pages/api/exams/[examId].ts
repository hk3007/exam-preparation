// src/pages/api/exam/[examId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Exam from "@/models/Exam";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { examId } = req.query;

  if (typeof examId !== "string") {
    return res.status(400).json({ error: "Invalid examId" });
  }

  await connectDB();

  try {
    switch (req.method) {
      case "GET":
        const exam = await Exam.findById(examId).lean();
        if (!exam) return res.status(404).json({ error: "Exam not found" });
        return res.status(200).json(exam);

      case "PATCH":
        const updatedExam = await Exam.findByIdAndUpdate(examId, req.body, { new: true });
        if (!updatedExam) return res.status(404).json({ error: "Exam not found" });
        return res.status(200).json({ success: true, exam: updatedExam });

      case "DELETE":
        const deletedExam = await Exam.findByIdAndDelete(examId);
        if (!deletedExam) return res.status(404).json({ error: "Exam not found" });
        return res.status(200).json({ success: true, message: "Exam deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) return res.status(500).json({ error: err.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
