"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HelpCircle } from "lucide-react";

interface Question {
  _id: string;
  topicSlug: string;
  topicName: string;
  type: "previous" | "practice";
  question: string;
  options?: string[];
  answer?: string | string[];
  year?: number;
}

export default function QuestionsPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "";
  const rawType = Array.isArray(params?.type) ? params.type[0] : params?.type || "";
  const type: "previous" | "practice" = rawType === "previous" ? "previous" : "practice";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [topicName, setTopicName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !type) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const encodedSlug = encodeURIComponent(slug);
        const res = await fetch(`/api/questions/${encodedSlug}/${type}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const qArray: Question[] = Array.isArray(data.data) ? data.data : [];
        setQuestions(qArray);

        // Use topicName from first question if available
        if (qArray.length > 0 && qArray[0].topicName) {
          setTopicName(qArray[0].topicName);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [slug, type]);

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-amber-600" />
            {type === "previous" ? "Previous Year Questions" : "Practice Questions"}
          </h1>
          {topicName && (
            <p className="text-lg text-gray-600 mt-2">
              Topic: <span className="font-semibold text-teal-700">{topicName}</span>
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center p-8 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">Loading questions...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center p-8 bg-red-50 rounded-xl shadow border border-red-200">
            <p className="text-red-600 font-medium text-lg">Error:</p>
            <p className="text-red-500 mt-2">{error}</p>
          </div>
        )}

        {/* Questions List */}
        {!loading && !error && questions.length > 0 ? (
          <ul className="space-y-8">
            {questions.map((q, idx) => (
              <li
                key={q._id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-gray-200 transition"
              >
                {/* Question */}
                <p className="text-gray-800 font-semibold text-lg mb-4">
                  <span className="text-teal-600 font-bold mr-2">{idx + 1}.</span>
                  {q.question}
                </p>

                {/* Options */}
                {q.options && (
                  <div className="mb-4">
                    <h4 className="font-medium text-teal-700 mb-2">Options:</h4>
                    <ul className="list-disc list-inside text-gray-700 ml-5 space-y-1">
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Answer */}
                {q.answer && (
                  <div className="mb-4 bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                    <h4 className="font-medium text-teal-800 mb-1">Answer:</h4>
                    {Array.isArray(q.answer) ? (
                      <ul className="list-disc list-inside text-teal-800 ml-5 space-y-1">
                        {q.answer.map((ans, i) => (
                          <li key={i}>{ans}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-teal-800">{q.answer}</p>
                    )}
                  </div>
                )}

                {/* Year */}
                {q.year && type === "previous" && (
                  <span className="text-xs text-gray-500 mt-1 block text-right">
                    Year: {q.year}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          // Empty State
          !loading &&
          !error && (
            <div className="text-center p-12 bg-white rounded-xl shadow-lg">
              <HelpCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No {type} questions available for this topic yet.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
