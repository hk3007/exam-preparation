// src/pages/api/exams/[examId]/subjects.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();

    const { examId } = req.query;

    // Validate examId
    if (typeof examId !== "string" || !Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ error: "Invalid examId" });
    }

    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const sort = (req.query.sort as string) || "asc";

    const query = { examIds: { $in: [examId] } };

    const subjects = await Subject.find(query)
      .sort({ name: sort === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Subject.countDocuments(query);

    return res.status(200).json({
      subjects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    return res.status(500).json({ error: "Failed to fetch subjects" });
  }
}
