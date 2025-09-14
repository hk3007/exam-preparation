// src/app/api/exams/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Exam from "@/models/Exam";

export async function GET() {
  try {
    await connectDB();
    const exams = await Exam.find({}, { name: 1 }).lean();
    return NextResponse.json({ exams }); // ✅ wrap in object
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}