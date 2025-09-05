import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Topic from "@/models/Topic";
import { Types } from "mongoose";

interface TopicDoc {
  _id: Types.ObjectId;
  title: string;
  description?: any; // ✅ can be string, array, or object
  exam: string;
  slug: string;
  link: string;
  views: number;
}

export type DescriptionNode =
  | string
  | {
      point?: string;
      expression?: string;
      example?: string;
      properties?: DescriptionNode[];
      details?: DescriptionNode[];
      [key: string]: any;
    };

export interface TopicType {
  id: string;
  name: string;
  description?: DescriptionNode[]; // ✅ structured description
  exam: string;
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
      return NextResponse.json(
        { error: "Topic ID or slug not provided" },
        { status: 400 }
      );
    }

    await connectDB();

    const topicDoc = await Topic.findOne<TopicDoc>({
      $or: [
        { slug: topicid },
        {
          _id: Types.ObjectId.isValid(topicid)
            ? new Types.ObjectId(topicid)
            : undefined,
        },
      ],
    }).lean<TopicDoc | null>();

    if (!topicDoc) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: topicDoc._id.toString(),
      name: topicDoc.title,
      description: topicDoc.description,
      exam: topicDoc.exam,
      views: topicDoc.views ?? 0,
      link: topicDoc.link,
    } as TopicType);
  } catch (err) {
    console.error("❌ Error in GET /api/topic/[topicid]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
