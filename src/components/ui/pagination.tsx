"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Pagination({ children }: { children: React.ReactNode }) {
  return <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center">{children}</nav>;
}

export function PaginationContent({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-row items-center gap-2">{children}</ul>;
}

export function PaginationItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export function PaginationLink({
  isActive,
  children,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "h-9 w-9 rounded-md border text-sm flex items-center justify-center",
        isActive
          ? "bg-primary text-white"
          : "bg-white hover:bg-gray-100 text-gray-700"
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function PaginationPrevious(props: React.ComponentProps<"button">) {
  return (
    <button
      className="h-9 px-3 rounded-md border text-sm bg-white hover:bg-gray-100 text-gray-700"
      {...props}
    >
      Prev
    </button>
  );
}

export function PaginationNext(props: React.ComponentProps<"button">) {
  return (
    <button
      className="h-9 px-3 rounded-md border text-sm bg-white hover:bg-gray-100 text-gray-700"
      {...props}
    >
      Next
    </button>
  );
}
