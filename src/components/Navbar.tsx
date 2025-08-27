"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Shield,
  User,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

type ExamName = "UPSC" | "JEE" | "NEET";

interface ExamStructure {
  subjects: string[];
}

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

const navigation = [
  { name: "Home", href: "/" },
  { name: "Latest News", href: "/news" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openExam, setOpenExam] = useState<ExamName | null>(null);
  const [openSubject, setOpenSubject] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterExam = (examKey: ExamName) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setOpenExam(examKey);
  };

  const handleMouseLeaveExam = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenExam(null);
      setOpenSubject(null);
    }, 150);
  };

  const handleMouseEnterSubject = (subject: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setOpenSubject(subject);
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-sm bg-background/70 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
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
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Desktop Exams Dropdown */}
            {Object.keys(exams).map((exam) => {
              const examKey = exam as ExamName;

              return (
                <div
                  key={exam}
                  className="relative h-full"
                  onMouseEnter={() => handleMouseEnterExam(examKey)}
                  onMouseLeave={handleMouseLeaveExam}
                >
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 rounded-md text-sm font-bold transition-colors h-full"
                  >
                    {exam} <ChevronDown size={16} />
                  </Button>

                  {openExam === examKey && (
                    <div className="absolute left-0 top-full mt-2 bg-popover text-popover-foreground border rounded-md shadow-lg w-52 z-50 animate-fadeIn">
                      {exams[examKey].subjects.map((subject) => (
                        <div
                          key={subject}
                          className="relative"
                          onMouseEnter={() => handleMouseEnterSubject(subject)}
                        >
                          <Link
                            href={`/exams/${examKey}/${subject}`}
                            className="flex w-full items-center justify-between px-4 py-2 hover:bg-accent rounded-md transition"
                          >
                            {subject}
                            <ChevronRight size={14} />
                          </Link>

                          {openSubject === subject && (
                            <div className="absolute top-0 left-full ml-1 bg-popover text-popover-foreground border rounded-md shadow-lg min-w-[220px] z-50 animate-fadeIn">
                              <Link
                                href={`/exams/${examKey}/${subject}/chapters`}
                                className="block px-4 py-2 hover:bg-accent rounded-md transition"
                              >
                                Chapters
                              </Link>
                              <Link
                                href={`/exams/${examKey}/${subject}/previous-year`}
                                className="block px-4 py-2 hover:bg-accent rounded-md transition"
                              >
                                Previous Year Questions
                              </Link>
                              <Link
                                href={`/exams/${examKey}/${subject}/info`}
                                className="block px-4 py-2 hover:bg-accent rounded-md transition"
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
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu & Actions */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="absolute top-4 right-4">
                    <X className="h-6 w-6" />
                  </Button>
                </SheetClose>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <SheetClose key={item.name} asChild>
                      <Link
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? "text-blue-600 bg-blue-600/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-bold text-foreground">Exams</p>
                    {Object.keys(exams).map((exam) => {
                      const examKey = exam as ExamName;
                      const isExamOpen = openExam === examKey;

                      return (
                        <div key={exam}>
                          <button
                            className="flex justify-between items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition"
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

                          {isExamOpen && (
                            <div className="pl-4 space-y-1">
                              {exams[examKey].subjects.map((subject) => {
                                const isSubjectOpen = openSubject === subject;

                                return (
                                  <div key={subject}>
                                    <button
                                      className="flex justify-between items-center w-full py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition"
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
                                    {isSubjectOpen && (
                                      <div className="pl-4 space-y-1">
                                        <SheetClose asChild>
                                          <Link
                                            href={`/exams/${examKey}/${subject}/chapters`}
                                            className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition"
                                          >
                                            Chapters
                                          </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                          <Link
                                            href={`/exams/${examKey}/${subject}/previous-year`}
                                            className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition"
                                          >
                                            Previous Year Questions
                                          </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                          <Link
                                            href={`/exams/${examKey}/${subject}/info`}
                                            className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition"
                                          >
                                            Information
                                          </Link>
                                        </SheetClose>
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
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <SheetClose asChild>
                      <Link
                        href="/settings"
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        Settings
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}