"use client";

import { useState, useEffect } from "react";

export default function Timer({ initialMinutes = 30 }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="text-xl font-bold">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
