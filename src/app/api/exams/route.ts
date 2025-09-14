import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Exam from "@/models/Exam";

export async function GET() {
  try {
    await connectDB();

    // just get plain exams list
    const exams = await Exam.find({}, { name: 1 }).lean();

    return NextResponse.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}
