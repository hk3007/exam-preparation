// src/pages/api/exams/[examId]/subjects.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { Types } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();

    const { examId } = req.query;

    // Validate examId
    if (typeof examId !== "string" || !Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ error: "Invalid examId" });
    }

    // Read values from body instead of query
    const { page = 1, limit = 10, sort = "asc" } = req.body;

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
