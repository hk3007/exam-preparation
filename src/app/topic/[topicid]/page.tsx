import TopicPage from "@/components/TopicPage";
import { connectDB } from "@/lib/mongodb";
import Topic from "@/models/Topic";
import { Types } from "mongoose";

interface Props {
  params: Promise<{ topicid: string }>;
}

type TopicDoc = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  views: number;
  link: string;
};

interface TopicType {
  id: string;
  name: string;
  description: string;
  questions: any[];
  views: number;
  link: string;
}

export async function generateStaticParams() {
  await connectDB();
  const topics = await Topic.find({}, { link: 1 }).lean<{ link: string }[]>();

  return topics.map((t) => ({
    topicid: t.link.replace("/topic/", ""),
  }));
}

export default async function TopicRoute({ params }: Props) {
  // ✅ await params
  const { topicid } = await params;

  if (!topicid) {
    return <p className="text-center py-10">Topic ID not provided</p>;
  }

  await connectDB();

  const topicDoc = await Topic.findOne<TopicDoc>({ link: `/topic/${topicid}` }).lean<TopicDoc | null>();

  if (!topicDoc) {
    return <p className="text-center py-10">Topic not found.</p>;
  }

  const topic: TopicType = {
    id: topicDoc._id.toString(),
    name: topicDoc.title,
    description: topicDoc.description,
    questions: [],
    views: topicDoc.views,
    link: topicDoc.link,
  };

  return <TopicPage topic={topic} />;
}
