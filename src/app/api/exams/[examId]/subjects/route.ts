import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  context: { params: Promise<{ examId: string }> } // 👈 params is a Promise
) {
  try {
    await connectDB();

    const { examId } = await context.params; // 👈 await before destructuring
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "asc";

    if (!Types.ObjectId.isValid(examId)) {
      return NextResponse.json({ error: "Invalid examId" }, { status: 400 });
    }

    const query = { examIds: { $in: [examId] } }; // adjust based on your schema

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
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
