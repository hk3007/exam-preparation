"use client";

import { useState } from "react";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="p-4 border rounded-lg w-fit">
      <h2 className="font-bold mb-2">Select Exam Date</h2>
      <input
        type="date"
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        className="px-2 py-1 border rounded"
      />
      {selectedDate && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {selectedDate.toDateString()}
        </p>
      )}
    </div>
  );
}
