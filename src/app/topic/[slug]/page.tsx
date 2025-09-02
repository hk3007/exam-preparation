import { TopicType } from "@/app/api/topic/[topicid]/route";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`http://localhost:3000/api/topic/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold text-center">
          ❌ Failed to fetch topic "{slug}".
        </p>
      </div>
    );
  }

  const topic: TopicType = await res.json();

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col items-center space-y-4">
      <h1 className="text-4xl font-bold text-indigo-700 text-center">
        {topic.name}
      </h1>

      <p className="text-gray-700 text-lg text-center">
        {topic.description}
      </p>

      <div className="text-gray-500 text-sm text-center">
        Views: {topic.views ?? 0}
      </div>
    </div>
  );
}
