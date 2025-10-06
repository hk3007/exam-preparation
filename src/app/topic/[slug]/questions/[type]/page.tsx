"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HelpCircle, CheckCircle2, XCircle, FileText } from "lucide-react";

interface Question {
  _id: string;
  topicSlug: string;
  topicName: string;
  type: "previous" | "practice";
  question: string;
  options?: string[];
  answer?: string | string[];
  steps?: string[];
  year?: number;
  examIds?: string[];
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
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, number | null>>({});
  const [showSteps, setShowSteps] = useState<Record<string, boolean>>({});

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

  const handleOptionClick = (qId: string, idx: number) => {
    setSelected((prev) => ({ ...prev, [qId]: idx }));
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  };

  const handleRevealAnswer = (qId: string) => {
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  };

  const toggleSteps = (qId: string) => {
    setShowSteps((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-gray-50 min-h-screen py-12 md:py-16">
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
            {questions.map((q, idx) => {
              const isRevealed = revealed[q._id];
              const selectedOpt = selected[q._id];
              const correct =
                typeof q.answer === "string"
                  ? q.answer
                  : Array.isArray(q.answer)
                  ? q.answer[0]
                  : null;

              return (
                <li
                  key={q._id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-gray-200 transition"
                >
                  {/* Question */}
                  <p className="text-gray-800 font-semibold text-lg mb-4">
                    <span className="text-teal-600 font-bold mr-2">{idx + 1}.</span>
                    {q.question}
                  </p>

                  {/* Options OR Subjective */}
                  {q.options ? (
                    <div className="space-y-3">
                      {q.options.map((opt, i) => {
                        const isSelected = selectedOpt === i;
                        const isCorrect = correct === opt;

                        return (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(q._id, i)}
                            className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                              isSelected
                                ? isCorrect
                                  ? "bg-green-100 border-green-400 text-green-800"
                                  : "bg-red-100 border-red-400 text-red-800"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-600 italic">
                      Subjective question. Think & reveal answer.
                      {!isRevealed && (
                        <button
                          onClick={() => handleRevealAnswer(q._id)}
                          className="ml-4 px-4 py-1 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                        >
                          Reveal Answer
                        </button>
                      )}
                    </div>
                  )}

                  {/* Answer */}
                  {isRevealed && (
                    <div className="mt-4 bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                      <h4 className="font-medium text-teal-800 mb-1 flex items-center gap-2">
                        {q.options ? (
                          correct === q.options[selectedOpt || 0] ? (
                            <CheckCircle2 className="text-green-600 h-5 w-5" />
                          ) : (
                            <XCircle className="text-red-600 h-5 w-5" />
                          )
                        ) : (
                          <CheckCircle2 className="text-teal-600 h-5 w-5" />
                        )}
                        Answer:
                      </h4>
                      {q.answer ? (
                        Array.isArray(q.answer) ? (
                          <ul className="list-disc list-inside text-teal-800 ml-5 space-y-1">
                            {q.answer.map((ans, i) => (
                              <li key={i}>{ans}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-teal-800">{q.answer}</p>
                        )
                      ) : (
                        <p className="text-gray-500 italic">Coming soon...</p>
                      )}

                      {/* Steps (button only for objective) */}
                      {q.steps && q.steps.length > 0 ? (
                        <div className="mt-3">
                          {!showSteps[q._id] ? (
                            <button
                              onClick={() => toggleSteps(q._id)}
                              className="flex items-center gap-2 px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
                            >
                              <FileText className="h-4 w-4" /> Show Steps
                            </button>
                          ) : (
                            <div>
                              <h5 className="font-semibold text-teal-700">Steps:</h5>
                              <ul className="list-decimal list-inside text-gray-700 ml-5 space-y-1">
                                {q.steps.map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        isRevealed && <p className="text-gray-500 italic mt-2">Steps coming soon...</p>
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
              );
            })}
          </ul>
        ) : (
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
