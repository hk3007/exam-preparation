"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("shrink-0 bg-gray-200 h-[1px] w-full", className)}
      {...props}
    />
  );
}
