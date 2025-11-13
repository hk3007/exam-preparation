"use client";

import { useEffect, useState } from "react";

interface Chapter {
  _id: string;
  name: string;
  topics: string[];
  subjectIds: string[];
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [form, setForm] = useState({ name: "", topics: "", subjectIds: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  // Fetch chapters with pagination
  const fetchChapters = async () => {
    const res = await fetch(`/api/chapters`);
    const data = await res.json();
    setTotal(data.length);
    const start = (page - 1) * limit;
    const end = start + limit;
    setChapters(data.slice(start, end));
  };

  useEffect(() => {
    fetchChapters();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      topics: form.topics.split(",").map((t) => t.trim()),
      subjectIds: form.subjectIds.split(",").map((id) => id.trim()),
    };

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/chapters/${editId}` : `/api/chapters`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({ name: "", topics: "", subjectIds: "" });
    setEditId(null);
    fetchChapters();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await fetch(`/api/chapters/${id}`, { method: "DELETE" });
      fetchChapters();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        📘 Manage Chapters
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Chapter Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Topics (comma-separated)"
          value={form.topics}
          onChange={(e) => setForm({ ...form, topics: e.target.value })}
        />
        <input
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Subject IDs (comma-separated)"
          value={form.subjectIds}
          onChange={(e) => setForm({ ...form, subjectIds: e.target.value })}
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-3 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          {editId ? "Update Chapter" : "Add Chapter"}
        </button>
      </form>

      {/* TABLE VIEW */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-blue-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Topics</th>
              <th className="text-left px-4 py-3 font-semibold">Subject IDs</th>
              <th className="text-center px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chapters.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No chapters found.
                </td>
              </tr>
            ) : (
              chapters.map((ch) => (
                <tr
                  key={ch._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{ch.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {ch.topics.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {ch.subjectIds.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setEditId(ch._id);
                        setForm({
                          name: ch.name,
                          topics: ch.topics.join(", "),
                          subjectIds: ch.subjectIds.join(", "),
                        });
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ch._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-md ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
