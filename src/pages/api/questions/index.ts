import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Question from "@/models/Question";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === "GET") {
      const questions = await Question.find().sort({ createdAt: -1 });
      return res.status(200).json(questions);
    }

    if (req.method === "POST") {
      const { topicSlug, topicName, type, question, answer, steps, examIds } = req.body;

      const newQuestion = await Question.create({
        topicSlug,
        topicName,
        type,
        question,
        answer,
        steps,
        examIds,
      });

      return res.status(201).json(newQuestion);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
