import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Exam from "@/models/Exam";

export async function GET(
  req: Request,
  context: { params: Promise<{ examId: string }> }
) {
  try {
    // ✅ await params since it's a Promise
    const { examId } = await context.params;

    await connectDB();
    const exam = await Exam.findOne({ name: examId }).lean();

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
