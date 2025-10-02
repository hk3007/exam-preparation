import React from "react";
import { connectDB } from "@/lib/mongodb";
import Topic, { DescriptionNode, TopicLean } from "@/models/Topic";
import Question, { QuestionLean } from "@/models/Question";
import { BookOpen, Eye, Lightbulb, Hash, HelpCircle } from "lucide-react";
import Link from "next/link";

//
// 🎨 Recursive Renderer
//
function renderDescription(node: DescriptionNode, depth = 0): React.ReactNode {
  return (
    <div
      className={`transition-all duration-300 ${
        depth === 0
          ? "bg-white rounded-3xl shadow-2xl p-8 md:p-12 my-6"
          : "bg-gray-50 border-l-4 border-teal-400 p-6 ml-6 mt-4 rounded-xl"
      }`}
    >
      {/* Heading / Point */}
      {node.point && (
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-6 w-6 text-teal-600" />
          <h3 className="font-bold text-teal-900 text-lg md:text-2xl">{node.point}</h3>
        </div>
      )}

      {/* Expression / Formula */}
      {node.expression && (
        <div className="bg-teal-50 p-4 rounded-lg my-3 font-mono text-sm md:text-base text-gray-800 border border-teal-200 shadow-inner whitespace-pre-line">
          <Hash className="inline-block w-5 h-5 mr-2 text-teal-600" />
          {node.expression}
        </div>
      )}

      {/* Simple Example */}
      {node.example && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 my-3 shadow-sm">
          <Lightbulb className="h-5 w-5 mt-1 text-amber-600 flex-shrink-0" />
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            <span className="font-medium">Example:</span> {node.example}
          </p>
        </div>
      )}
      
      {/* Rich Examples */}
      {node.examples?.map((ex, idx) => (
        <div
          key={`example-${idx}`}
          className="bg-amber-50 border border-amber-300 rounded-xl p-5 my-4 shadow-lg"
        >
          <h4 className="font-semibold text-amber-800 text-base md:text-lg mb-2">
            💡 {ex.title}
          </h4>
          {ex.given && (
            <div className="text-sm md:text-base mb-2">
              <strong>Given:</strong>
              <ul className="list-disc list-inside ml-5">
                {Object.entries(ex.given).map(([key, value]) => (
                  <li key={`given-${key}`}>{key}: {JSON.stringify(value)}</li>
                ))}
              </ul>
            </div>
          )}
          {ex.steps && (
            <div className="text-sm md:text-base mb-2">
              <strong>Steps:</strong>
              <ul className="list-disc list-inside ml-5">
                {Object.entries(ex.steps).map(([key, value]) => (
                  <li key={`step-${key}`}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
          {ex.answer && (
            <div className="text-sm md:text-base">
              <strong>Answer:</strong>
              <ul className="list-disc list-inside ml-5">
                {Object.entries(ex.answer).map(([key, value]) => (
                  <li key={`answer-${key}`}>{key}: {JSON.stringify(value)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Tables */}
      {node.tables?.map((table, idx) => (
        <div key={idx} className="overflow-x-auto my-4">
          <table className="min-w-full border border-gray-200 rounded-xl text-sm md:text-base">
            <thead className="bg-teal-100">
              <tr>
                {table.headers.map((header, hIdx) => (
                  <th key={hIdx} className="px-4 py-2 text-left font-semibold text-teal-800 border-b border-gray-300">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2 border-b border-gray-200 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Nested Details / Bullets */}
      {node.details?.length && (
        <div className="mt-3 ml-4 space-y-1 text-sm md:text-base text-gray-600">
          {node.details.map((detail, idx) =>
            typeof detail === "string" ? (
              <li key={idx} className="list-disc list-inside">{detail}</li>
            ) : (
              <div key={idx}>{renderDescription(detail, depth + 1)}</div>
            )
          )}
        </div>
      )}

      {/* Nested Properties */}
      {node.properties?.map((child, idx) => (
        <React.Fragment key={`prop-${idx}`}>
          {renderDescription(child, depth + 1)}
        </React.Fragment>
      ))}
    </div>
  );
}

//
// 📄 Topic Page Component
//
export default async function TopicPage({ params }: { params: { slug: string } }) {
  await connectDB();

  // Remove 'await' from params
  const { slug } = await params;

  // Fetch topic
  const topic: TopicLean | null = await Topic.findOne({ slug }).lean<TopicLean>();

  // Fetch questions
  const questions: (QuestionLean & { _id: string })[] = await Question.find({ topicSlug: slug })
    .sort({ year: -1, createdAt: -1 })
    .lean<(QuestionLean & { _id: string })[]>(); // ✅ Type-safe array

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-lg font-medium text-center bg-white px-8 py-4 rounded-xl shadow-md border border-red-200">
          ❌ Topic "{slug}" not found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topic Content */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-extrabold text-teal-900 leading-tight">{topic.name}</h1>
          </div>

          {topic.description?.map((node, idx) => (
            <React.Fragment key={idx}>{renderDescription(node)}</React.Fragment>
          ))}

        </div>

        {/* Sidebar Buttons */}
        <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-24 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Questions</h2>
          <div className="flex flex-col gap-4">
            <Link
              href={`/topic/${slug}/questions/previous`}
              className="block py-3 px-4 rounded-lg bg-teal-600 text-white text-center font-medium hover:bg-teal-700 transition"
            >
              Previous Year Questions
            </Link>
            <Link
              href={`/topic/${slug}/questions/practice`}
              className="block py-3 px-4 rounded-lg bg-amber-500 text-white text-center font-medium hover:bg-amber-600 transition"
            >
              Practice Questions
            </Link>
          </div>
        </div>
      </div>

      {/* Footer / Views */}
      <div className="flex items-center justify-center text-gray-600 text-sm md:text-base mt-12">
        <Eye className="h-5 w-5 mr-2 text-teal-500" />
        <span className="font-medium">{topic.views ?? 0} Students viewed this</span>
      </div>
    </div>
  );
}
