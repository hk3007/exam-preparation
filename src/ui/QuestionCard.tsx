"use client";

import { useState } from "react";

type QuestionProps = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuestionCard({ question, options, answer }: QuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="border p-4 rounded-lg shadow">
      <p className="font-semibold">{question}</p>
      <div className="mt-2 space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`block w-full text-left px-3 py-2 rounded ${
              selected === opt
                ? opt === answer
                  ? "bg-green-200"
                  : "bg-red-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
