"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, ChevronDown, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Exam {
  _id: string
  name: string
}

interface Subject {
  _id: string
  name: string
}

interface PaginatedSubjects {
  subjects: Subject[]
  total: number
  page: number
  totalPages: number
}

export function Navbar() {
  const pathname = usePathname()
// for mobile navigation stack
  type MobileLevel = "root" | "exam" | "subject"

  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileLevel, setMobileLevel] = useState<MobileLevel>("root")
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  const [exams, setExams] = useState<Exam[]>([])
  const [subjectsMap, setSubjectsMap] = useState<Record<string, PaginatedSubjects>>({}) // support both wrapped/raw
  const [openExam, setOpenExam] = useState<string | null>(null)
  const [openSubject, setOpenSubject] = useState<string | null>(null)

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  const limit = 10

    useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    return () => {
      document.body.classList.remove("overflow-hidden") // cleanup
    }
  }, [mobileOpen])

  // ✅ Fetch exams on mount
  useEffect(() => {
    isMountedRef.current = true

    async function fetchExams() {
      try {
        const res = await fetch("/api/exams", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        })

        if (!res.ok) {
          console.error("API responded with status:", res.status)
          return
        }

        const data = await res.json()
        console.log("Exams response:", data)

        if (isMountedRef.current) setExams(data.exams ?? data) // support both wrapped/raw
      } catch (error) {
        console.error("Failed to fetch exams:", error)
      }
    }

    fetchExams()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  // ✅ Fetch subjects and update state automatically
  const fetchSubjects = async (examId: string, page = 1, limit = 10, sort = "asc") => {
    try {
      const res = await fetch(`/api/exams/${examId}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ page, limit, sort }),
      })

      if (!res.ok) {
        console.error("❌ Failed to fetch subjects:", res.status)
        return null
      }

      const data: PaginatedSubjects = await res.json()

      setSubjectsMap((prev) => ({
        ...prev,
        [examId]: data,
      }))

      return data
    } catch (err) {
      console.error("❌ Error fetching subjects:", err)
      return null
    }
  }

  const handleMouseEnterExam = (examId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      setOpenExam(examId)
      if (!subjectsMap[examId]) {
        fetchSubjects(examId, 1)
      }
    }, 100)
  }

  const handleMouseLeaveExam = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenExam(null)
      setOpenSubject(null)
    }, 150)
  }

  const handleMouseEnterSubject = (subjectId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setOpenSubject(subjectId)
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Latest News", href: "/news" },
  ]

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
              const subjectsData = subjectsMap[exam._id]
              return (
                <div
                  key={exam._id}
                  className="relative h-full"
                  onMouseEnter={() => handleMouseEnterExam(exam._id)}
                  onMouseLeave={handleMouseLeaveExam}
                >
                  <div className="flex items-center gap-1 rounded-md text-sm font-bold transition-colors h-full text-foreground px-3 py-2 cursor-default hover:bg-accent">
                    {exam.name} <ChevronDown size={16} />
                  </div>

                  {openExam === exam._id && subjectsData && (
                    <div className="absolute left-0 top-full mt-2 bg-popover text-popover-foreground border rounded-md shadow-lg w-60 z-50 animate-fadeIn">
                      {(subjectsData.subjects || []).map((subject) => (
                        <div
                          key={subject._id}
                          className="relative"
                          onMouseEnter={() => handleMouseEnterSubject(subject._id)}
                        >
                          <div className="flex w-full items-center justify-between px-4 py-2 hover:bg-accent rounded-md transition cursor-default">
                            {subject.name}
                            <ChevronRight size={14} />
                          </div>

                          {/* Third-level submenu - remains clickable */}
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
                          onClick={() => fetchSubjects(exam._id, subjectsData.page - 1)}
                          className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                          ⬅ Prev
                        </button>
                        <span>
                          {subjectsData.page}/{subjectsData.totalPages}
                        </span>
                        <button
                          disabled={subjectsData.page === subjectsData.totalPages}
                          onClick={() => fetchSubjects(exam._id, subjectsData.page + 1)}
                          className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                          Next ➡
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu (Hamburger) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => {
                setMobileOpen((prev) => !prev)
                setMobileLevel("root")
                setSelectedExam(null)
                setSelectedSubject(null)
              }}
              className="p-2 rounded-md hover:bg-accent"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <ChevronDown /> : <ChevronRight />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {mobileOpen && (
            <div className="absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-background border-t shadow-md z-40 md:hidden overflow-y-auto">
              <div className="flex flex-col h-full">
                {/* Header with back button */}
                {mobileLevel !== "root" && (
                  <div className="flex items-center px-4 py-3 border-b">
                    <button
                      onClick={() => {
                        if (mobileLevel === "subject") {
                          setMobileLevel("exam")
                          setSelectedSubject(null)
                        } else if (mobileLevel === "exam") {
                          setMobileLevel("root")
                          setSelectedExam(null)
                        }
                      }}
                      className="mr-3 text-blue-600 font-bold"
                    >
                      ← 
                    </button>
                    <span className="font-bold text-lg">
                      {mobileLevel === "exam" && selectedExam?.name}
                      {mobileLevel === "subject" && selectedSubject?.name}
                    </span>
                  </div>
                )}

                {/* Root level */}
                {mobileLevel === "root" && (
                  <div className="flex flex-col space-y-2 p-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-bold transition-colors ${
                          pathname === item.href
                            ? "text-blue-600 bg-blue-600/10"
                            : "text-foreground hover:text-foreground hover:bg-accent"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {exams.map((exam) => (
                      <button
                        key={exam._id}
                        onClick={() => {
                          setSelectedExam(exam)
                          setMobileLevel("exam")
                          if (!subjectsMap[exam._id]) fetchSubjects(exam._id, 1)
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-bold hover:bg-accent"
                      >
                        {exam.name}
                      </button>
                    ))}

                    <div className="pt-2 border-t">
                      <ThemeToggle />
                    </div>
                  </div>
                )}

                {/* Exam level → show subjects */}
                {mobileLevel === "exam" && selectedExam && (
                  <div className="flex flex-col space-y-2 p-4">
                    {subjectsMap[selectedExam._id]?.subjects.map((subject) => (
                      <button
                        key={subject._id}
                        onClick={() => {
                          setSelectedSubject(subject)
                          setMobileLevel("subject")
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent"
                      >
                        {subject.name}
                      </button>
                    ))}

                    {/* Pagination controls */}
                    {subjectsMap[selectedExam._id] && (
                      <div className="flex justify-between items-center px-3 py-2 border-t text-sm">
                        <button
                          disabled={subjectsMap[selectedExam._id].page === 1}
                          onClick={() =>
                            fetchSubjects(selectedExam._id, subjectsMap[selectedExam._id].page - 1)
                          }
                          className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                          ⬅ Prev
                        </button>
                        <span>
                          {subjectsMap[selectedExam._id].page}/
                          {subjectsMap[selectedExam._id].totalPages}
                        </span>
                        <button
                          disabled={
                            subjectsMap[selectedExam._id].page ===
                            subjectsMap[selectedExam._id].totalPages
                          }
                          onClick={() =>
                            fetchSubjects(selectedExam._id, subjectsMap[selectedExam._id].page + 1)
                          }
                          className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                          Next ➡
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Subject level → show links */}
                {mobileLevel === "subject" && selectedExam && selectedSubject && (
                  <div className="flex flex-col space-y-2 p-4">
                    <Link
                      href={`/exam/${selectedExam._id}/${selectedSubject._id}/chapters`}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 hover:bg-accent rounded-md"
                    >
                      Chapters
                    </Link>
                    <Link
                      href={`/exam/${selectedExam._id}/${selectedSubject._id}/previous-year`}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 hover:bg-accent rounded-md"
                    >
                      Previous Year Questions
                    </Link>
                    <Link
                      href={`/exam/${selectedExam._id}/${selectedSubject._id}/info`}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 hover:bg-accent rounded-md"
                    >
                      Information
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}
