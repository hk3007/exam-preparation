import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Subject from "@/models/Subject";
import Exam from "@/models/Exam";
import mongoose from "mongoose";

interface ExamQuery {
  _id?: string;
  name?: string;
}

interface SubjectQuery {
  examIds: mongoose.Types.ObjectId;
  _id?: string;
  name?: string;
}

export async function GET(
  req: Request,
  { params }: { params: { examid: string; subject: string } }
) {
  try {
    await connectDB();

    const { examid, subject } = params;

    // --- 1. Find Exam (by ID if valid, else by name)
    const examQuery: ExamQuery = {};
    if (mongoose.Types.ObjectId.isValid(examid)) {
      examQuery._id = examid;
    } else {
      examQuery.name = examid;
    }

    const exam = await Exam.findOne(examQuery).lean<{ _id: mongoose.Types.ObjectId; name: string }>();
    if (!exam) {
      return NextResponse.json(
        { success: false, message: `Exam &quot;${examid}&quot; not found` },
        { status: 404 }
      );
    }

    // --- 2. Find Subject (by ID if valid, else by name) + examId reference
    const subjectQuery: SubjectQuery = { examIds: exam._id };
    if (mongoose.Types.ObjectId.isValid(subject)) {
      subjectQuery._id = subject;
    } else {
      subjectQuery.name = subject;
    }

    const subjectDoc = await Subject.findOne(subjectQuery).lean<{ _id: mongoose.Types.ObjectId; name: string }>();
    if (!subjectDoc) {
      return NextResponse.json(
        { success: false, message: `Subject &quot;${subject}&quot; not found for exam &quot;${exam.name}&quot;` },
        { status: 404 }
      );
    }

    // --- 3. Fetch Chapters for this subject
    const chapters = await Chapter.find({
      subjectIds: subjectDoc._id,
    }).lean();

    return NextResponse.json({
      success: true,
      exam: { id: exam._id, name: exam.name },
      subject: { id: subjectDoc._id, name: subjectDoc.name },
      chapters,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}