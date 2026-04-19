import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "flame" | "cyan" | "gold" | "neutral" | "success";

const tones: Record<Tone, string> = {
  flame: "bg-flame-500/15 text-flame-400 border-flame-500/30",
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  gold: "bg-gold-500/15 text-gold-400 border-gold-500/30",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  neutral: "bg-white/5 text-text-dim border-white/10",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
