"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HelpCircle } from "lucide-react";

interface Question {
  _id: string;
  topicSlug: string;
  type: "previous" | "practice";
  question: string;
  answer?: string;
  year?: number;
}

// Helper to safely extract a single string parameter
const getParamString = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) {
    return param[0] ?? "";
  }
  return param ?? "";
};

export default function QuestionsPage() {
  const params = useParams();

  // Extract slug and type safely
  const slug = getParamString(params?.slug);
  const rawType = getParamString(params?.type);

  const type: "previous" | "practice" =
    rawType === "previous" || rawType === "practice" ? rawType : "practice";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !type) {
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Encode the slug to match DB storage
        const encodedSlug = encodeURIComponent(slug);

        const res = await fetch(`/api/questions/${encodedSlug}/${type}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error ${res.status}`);
        }

        const data = await res.json();
        setQuestions(Array.isArray(data.data) ? data.data : []);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [slug, type]);

  const headerText = type === "previous" ? "Previous Year Questions" : "Practice Questions";
  const emptyMessage = `No ${type} questions available for this topic yet.`;

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-amber-600" />
            {headerText}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Topic: <span className="font-semibold text-teal-700">{slug.replace(/-/g, " ")}</span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center p-8 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">Loading questions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-8 bg-red-50 rounded-xl shadow border border-red-200">
            <p className="text-red-600 font-medium text-lg">Error:</p>
            <p className="text-red-500 mt-2">{error}</p>
          </div>
        )}

        {/* Questions List */}
        {!loading && !error && questions.length > 0 && (
          <ul className="space-y-6">
            {questions.map((q, index) => (
              <li
                key={q._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-800 font-medium text-lg leading-relaxed">
                    <span className="font-bold text-teal-600 mr-2">{index + 1}.</span>
                    {q.question}
                  </p>
                </div>

                {q.answer && (
                  <p className="text-sm text-teal-800 mt-3 p-3 bg-teal-50 border-l-4 border-teal-400 rounded-md">
                    <span className="font-semibold">Answer:</span> {q.answer}
                  </p>
                )}

                {q.year && type === "previous" && (
                  <span className="text-xs text-gray-500 mt-3 block text-right">
                    Year: {q.year}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Empty State */}
        {!loading && !error && questions.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <HelpCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
