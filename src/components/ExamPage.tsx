"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, FileText } from "lucide-react";
import { exams } from "@/data/exams";

interface ExamPageProps {
  examId: string;
}

export default function ExamPage({ examId }: ExamPageProps) {
  // Normalize examId to uppercase to match keys
  const exam = exams[examId.toUpperCase()];

  if (!exam) {
    return <p className="text-center py-10">Exam not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-10 px-4">
      {/* Exam Header */}
      <section className="text-center">
        <h1 className="text-4xl font-bold">{exam.name} Exam Preparation</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          {exam.description}
        </p>
      </section>

      {/* Upcoming Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Upcoming Exam Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{exam.upcomingDate}</p>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            Subjects Covered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {exam.subjects.map((sub, idx) => (
              <li key={idx}>{sub}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Question Paper Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Question Paper Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{exam.questionPaperPattern}</p>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg">Start Preparing {exam.name}</Button>
      </div>
    </div>
  );
}
