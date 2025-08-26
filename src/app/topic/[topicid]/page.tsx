import TopicPage from "@/components/TopicPage";
import { topics } from "@/data/topics";

export default async function TopicRoute({ params }: { params: Promise<{ topicid: string }> }) {
  const { topicid } = await params;
  const topic = topics[topicid];

  if (!topic) {
    return <p className="text-center py-10">Topic not found.</p>;
  }

  return <TopicPage topic={topic} />;
}
