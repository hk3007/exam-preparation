"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching:", query);
    // TODO: add search logic here
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search exams or courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 border rounded-lg w-64"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Search
      </button>
    </div>
  );
}
