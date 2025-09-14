export interface Option {
  option: string;
  text: string;
  isCorrect: boolean;
  solution: string;
}

export interface Question {
  qNo: number;
  type: "objective" | "numerical" | "paragraph";
  questionText: string;
  options?: Option[];
  solution?: string;
}

export interface Topic {
  name: string;
  detailExplanation?: string;
  questions?: Question[];
}

export interface Chapter {
  name: string;
  topics: Topic[];
}

export interface Subject {
  name: string;
  chapters: Chapter[];
}

export interface Year {
  year: number;
  paperStyle: string;
  subjects: Subject[];
}

export interface Exam {
  name: string;
  basicInfo: {
    description: string;
    eligibility: string;
    mode: string;
  };
  subjects: Subject[];
  years: Year[];
}
