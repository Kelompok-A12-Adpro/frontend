import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-md border border-neutral-300 bg-background px-3 py-1 text-base placeholder:text-neutral-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400 focus:border-primary-400 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
