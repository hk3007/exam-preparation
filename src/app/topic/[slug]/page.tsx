import React from "react";
import { connectDB } from "@/lib/mongodb";
import Topic, { DescriptionNode, TopicLean } from "@/models/Topic";
import { BookOpen, Eye, Lightbulb, Hash } from "lucide-react";

// 🎨 Recursive renderer
function renderDescription(node: DescriptionNode, depth = 0): React.ReactNode {
  // Plain string node
  if (typeof node === "string") {
    return (
      <p
        key={Math.random()}
        className={`text-gray-700 leading-relaxed text-base md:text-lg ${
          depth > 0 ? "pl-5 py-2" : "py-3"
        } whitespace-pre-line`}
      >
        {node}
      </p>
    );
  }

  return (
    <div
      key={Math.random()}
      className={`rounded-2xl transition-all duration-300 ${
        depth > 0
          ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-400 p-5 ml-4 mt-4"
          : "bg-white shadow-md border border-slate-200 p-6 md:p-8 mt-6"
      }`}
    >
      {/* Point / Heading */}
      {node.point && (
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-6 w-6 text-indigo-500" />
          <h3 className="font-bold text-indigo-800 text-lg md:text-2xl">
            {node.point}
          </h3>
        </div>
      )}

      {/* Expression */}
      {node.expression && (
        <div
          className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 
						p-4 rounded-xl my-4 font-mono text-sm md:text-base 
						text-slate-900 border border-slate-300 shadow-inner whitespace-pre-line"
        >
          <Hash className="inline-block w-4 h-4 mr-2 text-indigo-600" />
          {node.expression}
        </div>
      )}

      {/* Example */}
      {node.example && (
        <div
          className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 
						rounded-xl p-4 my-4 shadow-sm"
        >
          <Lightbulb className="h-5 w-5 mt-1 flex-shrink-0 text-yellow-600" />
          <p className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-line">
            <span className="font-semibold">Example:</span> {node.example}
          </p>
        </div>
      )}

      {/* Table rendering */}
      {node.tables?.map((table, idx) => (
        <div key={idx} className="overflow-x-auto my-4">
          <table className="min-w-full border border-slate-300 rounded-xl">
            <thead className="bg-indigo-100">
              <tr>
                {table.headers.map((header, hIdx) => (
                  <th
                    key={hIdx}
                    className="px-4 py-2 text-left font-semibold text-indigo-700 border-b border-slate-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={rIdx % 2 === 0 ? "bg-white" : "bg-indigo-50"}
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-2 border-b border-slate-200 text-gray-700"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Recursive rendering */}
      {node.details?.map((child, idx) => (
        <React.Fragment key={idx}>{renderDescription(child, depth + 1)}</React.Fragment>
      ))}
      {node.properties?.map((child, idx) => (
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
  await connectDB();

  const topic: TopicLean | null = await Topic.findOne({ slug }).lean<TopicLean>();

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <p className="text-red-700 text-lg font-semibold text-center bg-red-50 px-8 py-4 rounded-xl shadow-lg border border-red-200">
          ❌ Topic &quot;{slug}&quot; not found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-900 leading-tight drop-shadow-sm">
            {topic.name}
          </h1>
          <p className="text-indigo-600 mt-3 text-base md:text-lg font-medium">
            📘 Learn smartly with examples & key formulas
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-pink-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 md:p-12 border border-slate-200">
          {topic.description && Array.isArray(topic.description) && (
            <div className="flex flex-col space-y-6">
              {topic.description.map((node, idx) => (
                <React.Fragment key={idx}>{renderDescription(node)}</React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Views */}
        <div className="flex items-center justify-center text-slate-600 text-sm mt-10">
          <Eye className="h-4 w-4 mr-2 text-indigo-500" />
          <span className="font-medium">{topic.views ?? 0} Students viewed this</span>
        </div>
      </div>
    </div>
  );
}
