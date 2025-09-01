import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  context: { params: Promise<{ examId: string }> } // 👈 note: params is async
) {
  await connectDB();

  const { examId } = await context.params; // 👈 await here
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const sort = searchParams.get("sort") || "asc";

  if (!Types.ObjectId.isValid(examId)) {
    return NextResponse.json({ error: "Invalid examId" }, { status: 400 });
  }

  const query = { examIds: examId };

  const subjects = await Subject.find(query)
    .sort({ name: sort === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Subject.countDocuments(query);

  return NextResponse.json({
    subjects,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
