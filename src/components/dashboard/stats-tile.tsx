import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "flame" | "cyan" | "gold";
  className?: string;
};

const tones = {
  flame: "text-flame-400 bg-flame-500/12",
  cyan: "text-cyan-400 bg-cyan-500/12",
  gold: "text-gold-400 bg-gold-500/12",
};

export function StatsTile({ icon: Icon, label, value, sub, tone = "flame", className }: Props) {
  return (
    <div className={cn("glass rounded-3xl p-5", className)}>
      <div className="flex items-start justify-between">
        <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-2xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-xs uppercase tracking-wide text-text-muted">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {sub && <span className="text-xs text-text-dim">{sub}</span>}
      </div>
    </div>
  );
}
