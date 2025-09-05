import React from "react";
import { TopicType, DescriptionNode } from "@/app/api/topic/[topicid]/route";

// Recursive render function with modern styling
function renderDescription(node: DescriptionNode, depth = 0): React.ReactNode {
  if (typeof node === "string") {
    return (
      <div
        key={Math.random()}
        className={`pl-${depth * 6} py-3 text-gray-800 text-base`}
      >
        {node}
      </div>
    );
  }

  return (
    <div
      key={Math.random()}
      className={`pl-${depth * 6} py-4 px-4 bg-white rounded-xl shadow-md border border-gray-100`}
    >
      {/* Main Point */}
      {node.point && (
        <div className="font-semibold text-indigo-700 text-lg mb-2">
          {node.point}
        </div>
      )}

      {/* Expression */}
      {node.expression && (
        <div className="bg-gray-100 p-3 rounded-md my-2 font-mono text-sm text-center text-gray-700">
          {node.expression}
        </div>
      )}

      {/* Example */}
      {node.example && (
        <div className="italic bg-yellow-50 text-gray-800 p-3 rounded-md my-2 text-sm">
          Example: {node.example}
        </div>
      )}

      {/* Details / Subpoints */}
      {node.details &&
        node.details.length > 0 &&
        node.details.map((child, idx) => (
          <React.Fragment key={idx}>{renderDescription(child, depth + 1)}</React.Fragment>
        ))}

      {/* Properties */}
      {node.properties &&
        node.properties.length > 0 &&
        node.properties.map((child, idx) => (
          <React.Fragment key={idx}>{renderDescription(child, depth + 1)}</React.Fragment>
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

  // Dynamically determine base URL for server-side fetch
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window === "undefined" ? "http://localhost:3000" : "");

  const res = await fetch(`${baseUrl}/api/topic/${slug}`, {
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
    <div className="p-6 md:p-12 max-w-6xl mx-auto flex flex-col space-y-8 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 text-center mb-8">
        {topic.name}
      </h1>

      {/* Description */}
      {topic.description && Array.isArray(topic.description) && (
        <div className="flex flex-col space-y-6">
          {topic.description.map((node, idx) => (
            <React.Fragment key={idx}>{renderDescription(node)}</React.Fragment>
          ))}
        </div>
      )}

      {/* Views */}
      <div className="text-gray-500 text-sm text-center mt-6">
        👁 Views: {topic.views ?? 0}
      </div>
    </div>
  );
}
