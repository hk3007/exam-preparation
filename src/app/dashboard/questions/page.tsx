"use client";
import { useEffect, useState } from "react";

interface Question {
  _id: string;
  topicSlug: string;
  topicName: string;
  type: string;
  question: string;
  answer: string;
  steps: string[];
  examIds: string[];
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState({
    topicSlug: "",
    topicName: "",
    type: "practice",
    question: "",
    answer: "",
    steps: "",
    examIds: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchQuestions = async () => {
    const res = await fetch("/api/questions");
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      steps: form.steps.split("\n").map((s) => s.trim()),
      examIds: form.examIds.split(",").map((id) => id.trim()),
    };

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/questions/${editId}` : `/api/questions`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({
      topicSlug: "",
      topicName: "",
      type: "practice",
      question: "",
      answer: "",
      steps: "",
      examIds: "",
    });
    setEditId(null);
    fetchQuestions();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await fetch(`/api/questions/${id}`, { method: "DELETE" });
      fetchQuestions();
    }
  };

  // Pagination
  const start = (page - 1) * limit;
  const current = questions.slice(start, start + limit);
  const totalPages = Math.ceil(questions.length / limit);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">🧠 Manage Questions</h1>

      {/* --- Form --- */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg shadow"
      >
        <input
          className="border p-2 rounded"
          placeholder="Topic Slug"
          value={form.topicSlug}
          onChange={(e) => setForm({ ...form, topicSlug: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Topic Name"
          value={form.topicName}
          onChange={(e) => setForm({ ...form, topicName: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="practice">Practice</option>
          <option value="exam">Exam</option>
        </select>
        <input
          className="border p-2 rounded"
          placeholder="Exam IDs (comma-separated)"
          value={form.examIds}
          onChange={(e) => setForm({ ...form, examIds: e.target.value })}
        />
        <textarea
          className="border p-2 rounded col-span-2"
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />
        <textarea
          className="border p-2 rounded col-span-2"
          placeholder="Answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
        />
        <textarea
          className="border p-2 rounded col-span-2"
          placeholder="Steps (one per line)"
          value={form.steps}
          onChange={(e) => setForm({ ...form, steps: e.target.value })}
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editId ? "Update Question" : "Add Question"}
        </button>
      </form>

      {/* --- List --- */}
      <div className="mt-8 space-y-4">
        {current.map((q) => (
          <div
            key={q._id}
            className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg text-blue-800">{q.question}</h2>
            <p className="text-sm text-gray-600 mt-1">
              <b>Answer:</b> {q.answer}
            </p>
            <p className="text-sm text-gray-500">
              Topic: {q.topicName} ({q.type})
            </p>
            <ul className="text-sm text-gray-600 list-disc ml-5 mt-2">
              {q.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => {
                  setEditId(q._id);
                  setForm({
                    topicSlug: q.topicSlug,
                    topicName: q.topicName,
                    type: q.type,
                    question: q.question,
                    answer: q.answer,
                    steps: q.steps.join("\n"),
                    examIds: q.examIds.join(", "),
                  });
                }}
                className="text-blue-600 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(q._id)}
                className="text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Pagination --- */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
