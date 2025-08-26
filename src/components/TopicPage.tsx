"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";

export interface Question {
  id: number;
  type: "objective" | "subjective" | "numeric" | "paragraph";
  question: string;
  options?: string[]; // only for objective
  answer?: string | number;
  isPreviousYear?: boolean;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface TopicPageProps {
  topic: Topic;
}

export default function TopicPage({ topic }: TopicPageProps) {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const totalPages = Math.ceil(topic.questions.length / perPage);
  const currentQuestions = topic.questions.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{topic.name}</h1>
        <p className="text-gray-600">{topic.description}</p>
      </section>

      {/* Questions */}
      <div className="space-y-6">
        {currentQuestions.map((q) => (
          <Card key={q.id} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  Q{q.id}. {q.question}
                </span>
                {q.isPreviousYear && (
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">
                    Previous Year
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Render by type */}
              {q.type === "objective" && (
                <ul className="space-y-2">
                  {q.options?.map((opt, idx) => (
                    <li
                      key={idx}
                      className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}

              {q.type === "subjective" && (
                <textarea
                  className="w-full border rounded-md p-2"
                  placeholder="Write your answer here..."
                  rows={4}
                />
              )}

              {q.type === "numeric" && (
                <input
                  type="number"
                  className="w-full border rounded-md p-2"
                  placeholder="Enter numeric answer"
                />
              )}

              {q.type === "paragraph" && (
                <textarea
                  className="w-full border rounded-md p-2"
                  placeholder="Write a detailed answer..."
                  rows={6}
                />
              )}

              {q.answer && (
                <div className="mt-4 text-sm text-green-700">
                  <Separator className="my-2" />
                  <p>
                    <strong>Answer:</strong> {q.answer}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
