import React from "react";
import { connectDB } from "@/lib/mongodb";
import Topic, { DescriptionNode, TopicLean } from "@/models/Topic";
import { BookOpen, Eye } from "lucide-react";

// Recursive render function with better styling
function renderDescription(node: DescriptionNode, depth = 0): React.ReactNode {
  if (typeof node === "string") {
    return (
      <div
        key={Math.random()}
        className={`pl-${depth * 6} py-2 text-gray-700 text-base leading-relaxed`}
      >
        {node}
      </div>
    );
  }

  return (
    <div
      key={Math.random()}
      className={`pl-${depth * 4} py-5 px-5 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300`}
    >
      {node.point && (
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          <span className="font-semibold text-indigo-700 text-lg">
            {node.point}
          </span>
        </div>
      )}

      {node.expression && (
        <div className="bg-indigo-50 p-3 rounded-lg my-2 font-mono text-sm text-indigo-700 border border-indigo-100 text-center">
          ✨ {node.expression}
        </div>
      )}

      {node.example && (
        <div className="italic bg-yellow-50 text-gray-800 p-3 rounded-lg my-2 text-sm border border-yellow-100">
          📌 Example: {node.example}
        </div>
      )}

      {node.details?.map((child, idx) => (
        <React.Fragment key={idx}>
          {renderDescription(child, depth + 1)}
        </React.Fragment>
      ))}

      {node.properties?.map((child, idx) => (
        <React.Fragment key={idx}>
          {renderDescription(child, depth + 1)}
        </React.Fragment>
      ))}
    </div>
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectDB();

  const topic: TopicLean | null = await Topic.findOne({ slug }).lean<TopicLean>();

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold text-center bg-red-50 px-6 py-3 rounded-xl shadow-sm">
          ❌ Topic "{slug}" not found.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto flex flex-col space-y-10 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 text-center mb-4 drop-shadow-sm">
        {topic.title}
      </h1>

      {/* Short Divider */}
      <div className="w-24 h-1 bg-indigo-400 mx-auto rounded-full"></div>

      {/* Description */}
      {topic.description && Array.isArray(topic.description) && (
        <div className="flex flex-col space-y-6 mt-6">
          {topic.description.map((node, idx) => (
            <React.Fragment key={idx}>{renderDescription(node)}</React.Fragment>
          ))}
        </div>
      )}

      {/* Views */}
      <div className="flex items-center justify-center text-gray-600 text-sm mt-10">
        <Eye className="h-4 w-4 mr-2" /> {topic.views ?? 0} Views
      </div>
    </div>
  );
}
