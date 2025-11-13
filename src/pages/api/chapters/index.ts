import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Chapter from "@/models/Chapter";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === "GET") {
      const chapters = await Chapter.find().sort({ createdAt: -1 });
      return res.status(200).json(chapters);
    }

    if (req.method === "POST") {
      const { name, subjectIds, topics } = req.body;
      const newChapter = await Chapter.create({
        name,
        subjectIds,
        topics,
      });
      return res.status(201).json(newChapter);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
