import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Question from "@/models/Question";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const question = await Question.findById(id);
      return res.status(200).json(question);
    }

    if (req.method === "PUT") {
      const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await Question.findByIdAndDelete(id);
      return res.status(200).json({ message: "Deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
