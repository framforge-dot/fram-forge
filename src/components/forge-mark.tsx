import { cn } from "@/lib/cn";

export function ForgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <rect width="32" height="32" rx="8" fill="#111111" />
      <rect
        x="7.25"
        y="7.25"
        width="17.5"
        height="17.5"
        rx="3"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <rect x="19" y="19" width="7" height="7" rx="1.5" fill="#ffffff" />
    </svg>
  );
}
