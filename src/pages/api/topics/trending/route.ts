import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Topic from "@/models/Topic";

export async function GET() {
  try {
    await connectDB();

    // ✅ Get top 5 trending topics (customize the logic as per your schema)
    const trendingTopics = await Topic.find()
      .sort({ views: -1 }) // sort by popularity (views)
      .limit(5)
      .lean();

    return NextResponse.json(trendingTopics);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
