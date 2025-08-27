// src/data/exams.ts

export interface ExamData {
  name: string;
  upcomingDate: string;
  subjects: string[];
  questionPaperPattern: string;
  description: string;
}

// Use Record with a union type for keys so TypeScript knows valid exam IDs
export const exams: Record<"JEE" | "UPSC" | "NEET", ExamData> = {
  JEE: {
    name: "JEE",
    upcomingDate: "April 6, 2025",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    questionPaperPattern:
      "Objective-type MCQs, conducted online in two shifts (Paper 1 and Paper 2).",
    description:
      "Joint Entrance Examination (JEE) is the national-level entrance exam for admission to IITs, NITs, and other top engineering colleges in India.",
  },

  UPSC: {
    name: "UPSC",
    upcomingDate: "May 23, 2025",
    subjects: ["General Studies", "CSAT", "Optional Subject"],
    questionPaperPattern:
      "Prelims (MCQ based), Mains (Descriptive), followed by Interview.",
    description:
      "The Union Public Service Commission (UPSC) exam is India’s toughest exam for recruitment into civil services.",
  },

  NEET: {
    name: "NEET",
    upcomingDate: "June 9, 2025",
    subjects: ["Biology", "Physics", "Chemistry"],
    questionPaperPattern:
      "Objective-type MCQs, pen & paper-based, single session.",
    description:
      "National Eligibility cum Entrance Test (NEET) is the entrance exam for admission to MBBS, BDS, and other medical courses across India.",
  },
};

export type ExamId = keyof typeof exams; // "JEE" | "UPSC" | "NEET"
