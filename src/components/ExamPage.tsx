// src/components/ExamPage.tsx
import { ExamData } from "@/data/exams";

export default function ExamPage({
  exam,
}: {
  examId: string;
  exam: ExamData;
}) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{exam.name} Examination</h1>

      <p className="mb-2">
        <span className="font-semibold">Upcoming Date:</span> {exam.upcomingDate}
      </p>

      <p className="mb-4">{exam.description}</p>

      <h2 className="text-xl font-semibold mb-2">Subjects</h2>
      <ul className="list-disc list-inside mb-4">
        {exam.subjects.map((subject) => (
          <li key={subject}>{subject}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Question Paper Pattern</h2>
      <p>{exam.questionPaperPattern}</p>
    </div>
  );
}
