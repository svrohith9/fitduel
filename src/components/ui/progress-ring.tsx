"use client";

import { motion } from "framer-motion";

type Props = {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
  gradient?: "flame" | "cyan";
};

export function ProgressRing({
  value,
  size = 140,
  stroke = 10,
  label,
  sub,
  gradient = "flame",
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  const gradId = `ring-grad-${gradient}`;
  const stops =
    gradient === "flame"
      ? [
          { offset: "0%", color: "#ffb36b" },
          { offset: "50%", color: "#ff5e5b" },
          { offset: "100%", color: "#ff3d7f" },
        ]
      : [
          { offset: "0%", color: "#5df2ff" },
          { offset: "100%", color: "#00f0ff" },
        ];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {stops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-2xl font-bold tracking-tight text-text">
            {label}
          </span>
        )}
        {sub && <span className="text-[11px] text-text-dim">{sub}</span>}
      </div>
    </div>
  );
}
