"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-200">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
