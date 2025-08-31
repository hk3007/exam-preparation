"use client";

import { useEffect, useState } from "react";

interface ExamData {
  name: string;
  upcomingDate?: string;
  description?: string;
  subjects?: (string | { name: string })[]; // ✅ flexible type
  questionPaperPattern?: string;
}

export default function ExamPage({ examId }: { examId: string }) {
  const [exam, setExam] = useState<ExamData | null>(null);

  useEffect(() => {
    fetch(`/api/exams/${examId}`)
      .then((res) => res.json())
      .then((data) => setExam(data))
      .catch((err) => console.error("Failed to fetch exam:", err));
  }, [examId]);

  if (!exam) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{exam.name} Examination</h1>

      {exam.upcomingDate && (
        <p className="mb-2">
          <span className="font-semibold">Upcoming Date:</span>{" "}
          {exam.upcomingDate}
        </p>
      )}

      {exam.description && <p className="mb-4">{exam.description}</p>}

      {exam.subjects && exam.subjects.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Subjects</h2>
          <ul className="list-disc list-inside mb-4">
            {exam.subjects.map((subject, index) => (
              <li key={index}>
                {typeof subject === "string" ? subject : subject.name}
              </li>
            ))}
          </ul>
        </>
      )}

      {exam.questionPaperPattern && (
        <>
          <h2 className="text-xl font-semibold mb-2">Question Paper Pattern</h2>
          <p>{exam.questionPaperPattern}</p>
        </>
      )}
    </div>
  );
}
