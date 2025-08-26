"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

type ExamName = "UPSC" | "JEE" | "NEET";

interface ExamStructure {
  subjects: string[];
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openExam, setOpenExam] = useState<ExamName | null>(null);
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<any>(null);
  const [submenuDirection, setSubmenuDirection] = useState<"left" | "right">(
    "right"
  );

  const exams: Record<ExamName, ExamStructure> = {
    UPSC: {
      subjects: ["Polity", "History", "Geography"],
    },
    JEE: {
      subjects: ["Physics", "Chemistry", "Mathematics"],
    },
    NEET: {
      subjects: ["Biology", "Physics", "Chemistry"],
    },
  };

  // ✅ Detect if submenu would overflow on the right, then flip
  const handleSubmenuPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    if (rect.right + 240 > screenWidth) {
      setSubmenuDirection("left");
    } else {
      setSubmenuDirection("right");
    }
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ExamPrep
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          {Object.keys(exams).map((exam) => {
            const examKey = exam as ExamName;

            return (
              <div
                key={exam}
                className="relative group"
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  setOpenExam(examKey);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setOpenExam(null);
                    setOpenSubject(null);
                  }, 150);
                  setHoverTimeout(timeout);
                }}
              >
                <button className="flex items-center gap-1 hover:text-blue-600 transition">
                  {exam} <ChevronDown size={16} />
                </button>

                {/* Subjects Dropdown */}
                {openExam === examKey && (
                  <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-lg w-52 z-50 animate-fadeIn">
                    {exams[examKey].subjects.map((subject) => (
                      <div
                        key={subject}
                        className="relative"
                        onMouseEnter={(e) => {
                          if (hoverTimeout) clearTimeout(hoverTimeout);
                          setOpenSubject(subject);
                          handleSubmenuPosition(e);
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => {
                            setOpenSubject(null);
                          }, 200);
                          setHoverTimeout(timeout);
                        }}
                      >
                        <button className="flex w-full items-center justify-between px-4 py-2 hover:bg-blue-50 rounded-md transition">
                          {subject}
                          <ChevronRight size={14} />
                        </button>

                        {/* ✅ Level 2 Dropdown */}
                        {openSubject === subject && (
                          <div
                            className={`absolute top-0 ${
                              submenuDirection === "right"
                                ? "left-full ml-1"
                                : "right-full mr-1"
                            } bg-white border border-gray-200 text-gray-800 rounded-lg shadow-lg min-w-[220px] z-50 animate-fadeIn`}
                          >
                            <Link
                              href={`/exams/${examKey}/${subject}/chapters`}
                              className="block px-4 py-2 hover:bg-blue-50 rounded-md transition"
                            >
                              Chapters
                            </Link>
                            <Link
                              href={`/exams/${examKey}/${subject}/previous-year`}
                              className="block px-4 py-2 hover:bg-blue-50 rounded-md transition"
                            >
                              Previous Year Questions
                            </Link>
                            <Link
                              href={`/exams/${examKey}/${subject}/info`}
                              className="block px-4 py-2 hover:bg-blue-50 rounded-md transition"
                            >
                              Information
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <Link href="/news" className="hover:text-blue-600 transition">
            Latest News
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-50 text-gray-800 px-4 py-2 space-y-2 border-t border-gray-200 animate-fadeIn">
          <Link href="/" className="block py-2 hover:text-blue-600 transition">
            Home
          </Link>

          {Object.keys(exams).map((exam) => {
            const examKey = exam as ExamName;
            const isExamOpen = openExam === examKey;

            return (
              <div key={exam}>
                <button
                  className="flex justify-between items-center w-full py-2 hover:text-blue-600 transition"
                  onClick={() => {
                    setOpenExam(isExamOpen ? null : examKey);
                    setOpenSubject(null);
                  }}
                >
                  {exam}
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      isExamOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Subjects */}
                {isExamOpen && (
                  <div className="pl-4 space-y-1">
                    {exams[examKey].subjects.map((subject) => {
                      const isSubjectOpen = openSubject === subject;

                      return (
                        <div key={subject}>
                          <button
                            className="flex justify-between items-center w-full py-2 hover:text-blue-600 transition"
                            onClick={() =>
                              setOpenSubject(isSubjectOpen ? null : subject)
                            }
                          >
                            {subject}
                            <ChevronRight
                              size={14}
                              className={`transform transition-transform ${
                                isSubjectOpen ? "rotate-90" : ""
                              }`}
                            />
                          </button>

                          {/* ✅ Level 2 Dropdown in Mobile */}
                          {isSubjectOpen && (
                            <div className="pl-4 space-y-1">
                              <Link
                                href={`/exams/${examKey}/${subject}/chapters`}
                                className="block py-1 hover:text-blue-600 transition"
                              >
                                Chapters
                              </Link>
                              <Link
                                href={`/exams/${examKey}/${subject}/previous-year`}
                                className="block py-1 hover:text-blue-600 transition"
                              >
                                Previous Year Questions
                              </Link>
                              <Link
                                href={`/exams/${examKey}/${subject}/info`}
                                className="block py-1 hover:text-blue-600 transition"
                              >
                                Information
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/news"
            className="block py-2 hover:text-blue-600 transition"
          >
            Latest News
          </Link>
        </div>
      )}
    </nav>
  );
}
