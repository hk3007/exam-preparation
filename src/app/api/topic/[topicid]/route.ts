import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Topic from "@/models/Topic";
import { Types } from "mongoose";

// Type for the topic document returned by Mongoose
interface TopicDoc {
  _id: Types.ObjectId; // now TypeScript knows it's ObjectId
  title: string;
  description: string;
  views: number;
  link: string;
}

// Type for the API response
export interface TopicType {
  id: string;
  name: string;
  description: string;
  questions: any[];
  views: number;
  link: string;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ topicid: string }> }
) {
  try {
    const { topicid } = await context.params;

    if (!topicid) {
      return NextResponse.json({ error: "Topic ID not provided" }, { status: 400 });
    }

    await connectDB();

    // Explicitly type the result with <TopicDoc | null>
    const topicDoc = await Topic.findOne<TopicDoc>({ link: `/topic/${topicid}` }).lean<TopicDoc | null>();

    if (!topicDoc) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const topic: TopicType = {
      id: topicDoc._id.toString(), // now TS knows _id is ObjectId
      name: topicDoc.title,
      description: topicDoc.description,
      questions: [],
      views: topicDoc.views,
      link: topicDoc.link,
    };

    return NextResponse.json(topic);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
