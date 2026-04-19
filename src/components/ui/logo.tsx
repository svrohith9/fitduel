import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({
  className,
  size = "md",
  href = "/",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string | null;
}) {
  const sz =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  const markSize =
    size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";

  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "bg-flame grid place-items-center rounded-xl shadow-[0_6px_20px_-6px_rgba(255,61,127,0.6)]",
          markSize,
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-[60%] w-[60%]">
          <path
            d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
            fill="white"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={cn("font-bold tracking-tight", sz)}>
        Fit<span className="text-flame">Duel</span>
      </span>
    </span>
  );

  if (href === null) return content;
  return <Link href={href}>{content}</Link>;
}
