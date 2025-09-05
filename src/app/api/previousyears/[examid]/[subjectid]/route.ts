import { connectDB } from "@/lib/mongodb";
import PreviousYear from "@/models/PreviousYear";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  context: { params: { examid: string; subjectid: string } | Promise<{ examid: string; subjectid: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await context.params;
    const { examid, subjectid } = resolvedParams;

    // Convert strings to ObjectId
    const examObjectId = new ObjectId(examid);
    const subjectObjectId = new ObjectId(subjectid);

    const data = await PreviousYear.find({
      examIds: examObjectId,      // MongoDB will check inside array
      subjectIds: subjectObjectId,
    });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
