import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-base text-fg placeholder:text-subtle",
        className,
      )}
      {...props}
    />
  );
}
