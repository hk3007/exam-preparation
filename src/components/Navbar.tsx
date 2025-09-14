"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, ChevronDown, ChevronRight} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface Exam {
  _id: string;
  name: string;
}

interface Subject {
  _id: string;
  name: string;
}

interface PaginatedSubjects {
  subjects: Subject[];
  total: number;
  page: number;
  totalPages: number;
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<
    Record<string, PaginatedSubjects>
  >({});
  const [openExam, setOpenExam] = useState<string | null>(null);
  const [openSubject, setOpenSubject] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const limit = 10; // subjects per page

  // ✅ Fetch exams on mount
  useEffect(() => {
    async function fetchExams() {
      const res = await fetch("/api/exams");
      const data = await res.json();
      setExams(data);
    }
    fetchExams();
  }, []);

  // ✅ Fetch subjects (with pagination)
  const fetchSubjects = async (examId: string, page = 1) => {
    const res = await fetch(
      `/api/exams/${examId}/subjects?page=${page}&limit=${limit}&sort=asc`
    );
    const data = await res.json();
    setSubjectsMap((prev) => ({ ...prev, [examId]: data }));
  };

  const handleMouseEnterExam = (examId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenExam(examId);
    if (!subjectsMap[examId]) {
      fetchSubjects(examId, 1); // load first page on hover
    }
  };

  const handleMouseLeaveExam = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenExam(null);
      setOpenSubject(null);
    }, 150);
  };

  const handleMouseEnterSubject = (subjectId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenSubject(subjectId);
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Latest News", href: "/news" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-sm bg-background/70 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                ExamPrep
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-bold transition-colors ${
                  pathname === item.href
                    ? "text-blue-600 bg-blue-600/10"
                    : "text-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Exams Dropdown */}
            {exams.map((exam) => {
              const subjectsData = subjectsMap[exam._id];
              return (
                <div
                  key={exam._id}
                  className="relative h-full"
                  onMouseEnter={() => handleMouseEnterExam(exam._id)}
                  onMouseLeave={handleMouseLeaveExam}
                >
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 rounded-md text-sm font-bold transition-colors h-full text-foreground"
                  >
                    {exam.name} <ChevronDown size={16} />
                  </Button>

                  {openExam === exam._id && subjectsData && (
                    <div className="absolute left-0 top-full mt-2 bg-popover text-popover-foreground border rounded-md shadow-lg w-60 z-50 animate-fadeIn">
                      {(subjectsData.subjects || []).map((subject) => (
                        <div
                          key={subject._id}
                          className="relative"
                          onMouseEnter={() => handleMouseEnterSubject(subject._id)}
                        >
                          <Link
                            href={`/exam/${exam._id}/${subject._id}`}
                            className="flex w-full items-center justify-between px-4 py-2 hover:bg-accent rounded-md transition"
                          >
                            {subject.name}
                            <ChevronRight size={14} />
                          </Link>

                          {/* Third-level submenu */}
                          {openSubject === subject._id && (
                            <div className="absolute top-0 left-full ml-1 bg-popover text-popover-foreground border rounded-md shadow-lg min-w-[220px] z-50 animate-fadeIn">
                              <Link
                                href={`/exam/${exam._id}/${subject._id}/chapters`}
                                className="block px-4 py-2 hover:bg-accent rounded-md transition"
                              >
                                Chapters
                              </Link>
                              <Link
                                href={`/exam/${exam._id}/${subject._id}/previous-year`}
                                className="block px-4 py-2 hover:bg-accent rounded-md transition"
                              >
                                Previous Year Questions
                              </Link>
                              <Link
                                href={`/exam/${exam._id}/${subject._id}/info`}
                                className="block px-4 py-2 hover:bg-accent rounded-md transition"
                              >
                                Information
                              </Link>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Pagination Controls */}
                      <div className="flex justify-between items-center px-3 py-2 border-t text-sm">
                        <button
                          disabled={subjectsData.page === 1}
                          onClick={() =>
                            fetchSubjects(exam._id, subjectsData.page - 1)
                          }
                          className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                          ⬅ Prev
                        </button>
                        <span>
                          {subjectsData.page}/{subjectsData.totalPages}
                        </span>
                        <button
                          disabled={subjectsData.page === subjectsData.totalPages}
                          onClick={() =>
                            fetchSubjects(exam._id, subjectsData.page + 1)
                          }
                          className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                          Next ➡
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu ... (unchanged for now) */}
        </div>
      </div>
    </nav>
  );
}
