"use client";

import { useEffect, useState } from "react";

interface Subject {
  _id: string;
  name: string;
}

export default function SubjectsList({ examId }: { examId: string }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // 👈 matches API limit

  useEffect(() => {
    async function fetchSubjects() {
      const res = await fetch(
        `/api/exams/${examId}/subjects?page=${page}&limit=${limit}&sort=asc`
      );
      const data = await res.json();
      setSubjects(data.subjects);
      setTotalPages(data.totalPages);
    }
    fetchSubjects();
  }, [examId, page]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Subjects</h2>

      <ul className="space-y-2">
        {subjects.map((subj) => (
          <li
            key={subj._id}
            className="p-2 border rounded-md shadow-sm bg-white"
          >
            {subj.name}
          </li>
        ))}
      </ul>

      {/* Pagination buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ⬅ Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
