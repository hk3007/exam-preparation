import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Subject from "@/models/Subject";
import Exam from "@/models/Exam";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { examid: string; subject: string } }
) {
  try {
    await connectDB();

    const { examid, subject } = params;

    // 1. Find exam by name
    const exam = await Exam.findOne({ name: examid }).lean<{ _id: mongoose.Types.ObjectId }>();
    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    // 2. Find subject by name + examId
    const subjectDoc = await Subject.findOne({
      name: subject,
      examIds: exam._id,
    }).lean<{ _id: mongoose.Types.ObjectId }>();

    if (!subjectDoc) {
      return NextResponse.json(
        { success: false, message: "Subject not found for this exam" },
        { status: 404 }
      );
    }

    // 3. Fetch chapters linked to this subject
    const chapters = await Chapter.find({
      subjectIds: subjectDoc._id,
    }).lean();

    return NextResponse.json({ success: true, chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}
