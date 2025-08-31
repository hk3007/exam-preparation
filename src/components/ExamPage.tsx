"use client";

import { useEffect, useState } from "react";

interface ExamData {
  name: string;
  upcomingDate?: string;
  description?: string;
  subjects?: (string | { name: string })[];
  questionPaperPattern?: string;
  eligibility?: {
    nationality?: string;
    age?: { min?: number; max?: number; relaxations?: string };
    education?: string;
    attemptLimit?: { general?: number; OBC?: number; SCST?: string; PwBD?: string };
  };
  examDates?: {
    notificationDate?: string;
    applicationStart?: string;
    applicationEnd?: string;
    prelims?: string;
    mains?: string;
    admitCard?: string | null;
    result?: string | null;
    interview?: string | null;
    finalResult?: string | null;
  };
  examOverview?: {
    conductingBody?: string;
    officialWebsite?: string[];
    vacancies?: string;
    examLevel?: string;
    examMode?: string;
    applicationFee?: string;
    languages?: string[];
    numberOfPapers?: { prelims?: number; mains?: number };
    stages?: string[];
  };
  posts?: string[];
}

export default function ExamPage({ examId }: { examId: string }) {
  const [exam, setExam] = useState<ExamData | null>(null);

  useEffect(() => {
    fetch(`/api/exams/${examId}`)
      .then((res) => res.json())
      .then((data) => setExam(data))
      .catch((err) => console.error("Failed to fetch exam:", err));
  }, [examId]);

  if (!exam)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Exam Name */}
      <h1 className="text-4xl font-bold text-gray-900">{exam.name} Examination</h1>

      {/* Upcoming Date */}
      {exam.upcomingDate && (
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Upcoming Date:</span>{" "}
          <span className="text-indigo-600">{exam.upcomingDate}</span>
        </p>
      )}

      {/* Description */}
      {exam.description && <p className="text-gray-700 leading-relaxed">{exam.description}</p>}

      {/* Exam Overview */}
      {exam.examOverview && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Exam Overview</h2>
          {exam.examOverview.conductingBody && (
            <p>
              <span className="font-semibold">Conducting Body:</span> {exam.examOverview.conductingBody}
            </p>
          )}
          {exam.examOverview.officialWebsite && (
            <p>
              <span className="font-semibold">Official Website:</span>{" "}
              {exam.examOverview.officialWebsite.map((url, idx) => (
                <span key={idx} className="text-indigo-600">
                  <a href={url} target="_blank" rel="noreferrer">
                    {url}
                  </a>
                  {idx < exam.examOverview!.officialWebsite!.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          )}
          {exam.examOverview.vacancies && (
            <p>
              <span className="font-semibold">Vacancies:</span> {exam.examOverview.vacancies}
            </p>
          )}
          {exam.examOverview.examLevel && (
            <p>
              <span className="font-semibold">Exam Level:</span> {exam.examOverview.examLevel}
            </p>
          )}
          {exam.examOverview.examMode && (
            <p>
              <span className="font-semibold">Mode:</span> {exam.examOverview.examMode}
            </p>
          )}
          {exam.examOverview.applicationFee && (
            <p>
              <span className="font-semibold">Application Fee:</span> {exam.examOverview.applicationFee}
            </p>
          )}
          {exam.examOverview.languages && (
            <p>
              <span className="font-semibold">Languages:</span> {exam.examOverview.languages.join(", ")}
            </p>
          )}
          {exam.examOverview.numberOfPapers && (
            <p>
              <span className="font-semibold">Number of Papers:</span> Prelims - {exam.examOverview.numberOfPapers.prelims}, Mains - {exam.examOverview.numberOfPapers.mains}
            </p>
          )}
          {exam.examOverview.stages && (
            <p>
              <span className="font-semibold">Stages:</span> {exam.examOverview.stages.join(", ")}
            </p>
          )}
        </section>
      )}

      {/* Exam Dates */}
      {exam.examDates && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Exam Dates</h2>
          {Object.entries(exam.examDates).map(([key, value]) =>
            value ? (
              <p key={key}>
                <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
              </p>
            ) : null
          )}
        </section>
      )}

      {/* Subjects */}
      {exam.subjects && exam.subjects.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Subjects</h2>
          <ul className="list-disc list-inside">
            {exam.subjects.map((subj, idx) => (
              <li key={idx}>{typeof subj === "string" ? subj : subj.name}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Question Paper Pattern */}
      {exam.questionPaperPattern && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Question Paper Pattern</h2>
          <p className="text-gray-700 whitespace-pre-line">{exam.questionPaperPattern}</p>
        </section>
      )}

      {/* Eligibility */}
      {exam.eligibility && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Eligibility</h2>
          {exam.eligibility.nationality && (
            <p>
              <span className="font-semibold">Nationality:</span> {exam.eligibility.nationality}
            </p>
          )}
          {exam.eligibility.age && (
            <p>
              <span className="font-semibold">Age:</span> {exam.eligibility.age.min} - {exam.eligibility.age.max} (
              {exam.eligibility.age.relaxations})
            </p>
          )}
          {exam.eligibility.education && (
            <p>
              <span className="font-semibold">Education:</span> {exam.eligibility.education}
            </p>
          )}
          {exam.eligibility.attemptLimit && (
            <p>
              <span className="font-semibold">Attempt Limit:</span>{" "}
              General: {exam.eligibility.attemptLimit.general}, OBC: {exam.eligibility.attemptLimit.OBC}, SC/ST:{" "}
              {exam.eligibility.attemptLimit.SCST}, PwBD: {exam.eligibility.attemptLimit.PwBD}
            </p>
          )}
        </section>
      )}

      {/* Posts */}
      {exam.posts && exam.posts.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Available Posts</h2>
          <ul className="list-disc list-inside">
            {exam.posts.map((post, idx) => (
              <li key={idx}>{post}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
