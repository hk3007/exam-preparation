"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

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
    attemptLimit?: {
      general?: number;
      OBC?: number;
      SCST?: string;
      PwBD?: string;
    };
  };
  examDates?: Record<string, string | null>;
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
        <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
      </div>
    );

  // 🎨 Section header with icon
  const SectionHeader = ({
    icon: Icon,
    title,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
  }) => (
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <Icon className="w-5 h-5" />
      </div>
      {title}
    </h2>
  );

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto space-y-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          {exam.name} Examination
        </h1>
        {exam.upcomingDate && (
          <p className="text-lg text-indigo-600 font-medium flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Date: {exam.upcomingDate}
          </p>
        )}
        {exam.description && (
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {exam.description}
          </p>
        )}
      </div>

      {/* Exam Overview */}
      {exam.examOverview && (
        <section>
          <SectionHeader icon={FileText} title="Exam Overview" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {exam.examOverview.conductingBody && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Conducting Body:</span>{" "}
                {exam.examOverview.conductingBody}
              </div>
            )}
            {exam.examOverview.officialWebsite && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Official Website:</span>
                {exam.examOverview.officialWebsite.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline block"
                  >
                    {url}
                  </a>
                ))}
              </div>
            )}
            {exam.examOverview.vacancies && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Vacancies:</span>{" "}
                {exam.examOverview.vacancies}
              </div>
            )}
            {exam.examOverview.examLevel && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Exam Level:</span>{" "}
                {exam.examOverview.examLevel}
              </div>
            )}
            {exam.examOverview.examMode && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Mode:</span>{" "}
                {exam.examOverview.examMode}
              </div>
            )}
            {exam.examOverview.applicationFee && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Application Fee:</span>{" "}
                {exam.examOverview.applicationFee}
              </div>
            )}
            {exam.examOverview.languages && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Languages:</span>{" "}
                {exam.examOverview.languages.join(", ")}
              </div>
            )}
            {exam.examOverview.numberOfPapers && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Number of Papers:</span> Prelims{" "}
                - {exam.examOverview.numberOfPapers.prelims}, Mains -{" "}
                {exam.examOverview.numberOfPapers.mains}
              </div>
            )}
            {exam.examOverview.stages && (
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md">
                <span className="font-semibold">Stages:</span>{" "}
                {exam.examOverview.stages.join(", ")}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Exam Dates */}
      {exam.examDates && (
        <section>
          <SectionHeader icon={Calendar} title="Important Exam Dates" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(exam.examDates).map(([key, value]) =>
              value ? (
                <div
                  key={key}
                  className="bg-gradient-to-r from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100 shadow-sm"
                >
                  <span className="block font-semibold capitalize mb-1">
                    {key}
                  </span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Subjects */}
      {exam.subjects && exam.subjects.length > 0 && (
        <section>
          <SectionHeader icon={BookOpen} title="Subjects Covered" />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exam.subjects.map((subj, idx) => (
              <li
                key={idx}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md text-gray-800"
              >
                {typeof subj === "string" ? subj : subj.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Question Paper Pattern */}
      {exam.questionPaperPattern && (
        <section>
          <SectionHeader icon={FileText} title="Question Paper Pattern" />
          <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-5 rounded-2xl border">
            {exam.questionPaperPattern}
          </p>
        </section>
      )}

      {/* Eligibility */}
      {exam.eligibility && (
        <section>
          <SectionHeader icon={GraduationCap} title="Eligibility Criteria" />
          <div className="space-y-3 bg-white p-5 rounded-2xl shadow-sm">
            {exam.eligibility.nationality && (
              <p>
                <span className="font-semibold">Nationality:</span>{" "}
                {exam.eligibility.nationality}
              </p>
            )}
            {exam.eligibility.age && (
              <p>
                <span className="font-semibold">Age:</span>{" "}
                {exam.eligibility.age.min} - {exam.eligibility.age.max} (
                {exam.eligibility.age.relaxations})
              </p>
            )}
            {exam.eligibility.education && (
              <p>
                <span className="font-semibold">Education:</span>{" "}
                {exam.eligibility.education}
              </p>
            )}
            {exam.eligibility.attemptLimit && (
              <p>
                <span className="font-semibold">Attempt Limit:</span> General:{" "}
                {exam.eligibility.attemptLimit.general}, OBC:{" "}
                {exam.eligibility.attemptLimit.OBC}, SC/ST:{" "}
                {exam.eligibility.attemptLimit.SCST}, PwBD:{" "}
                {exam.eligibility.attemptLimit.PwBD}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Career Opportunities */}
      {exam.posts && exam.posts.length > 0 && (
        <section>
          <SectionHeader icon={Users} title="Career Opportunities" />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exam.posts.map((post, idx) => (
              <li
                key={idx}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md text-gray-800"
              >
                {post}
              </li>
            ))}
          </ul>
        </section>
      )}
    </motion.div>
  );
}
