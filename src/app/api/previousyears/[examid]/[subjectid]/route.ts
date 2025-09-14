import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PreviousYear from "@/models/PreviousYear";
import { ObjectId } from "mongodb";

interface PreviousYearDoc {
  _id: ObjectId;
  examIds: ObjectId[];
  subjectIds: ObjectId[];
  year: number;
  questions: { question: string; options: string[]; answer: string }[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ examid: string; subjectid: string }> }
) {
  try {
    await connectDB();

    const { examid, subjectid } = await params;

    // Convert strings to ObjectId
    const examObjectId = new ObjectId(examid);
    const subjectObjectId = new ObjectId(subjectid);

    const data = await PreviousYear.find<PreviousYearDoc>({
      examIds: examObjectId, // MongoDB will check inside array
      subjectIds: subjectObjectId,
    }).lean<PreviousYearDoc[]>();

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}