"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "flame" | "ghost" | "glass" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  fullWidth?: boolean;
};

const base =
  "relative inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-500/60 disabled:opacity-50 disabled:pointer-events-none select-none";

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

const variants: Record<Variant, string> = {
  flame:
    "bg-flame text-white shadow-[0_8px_30px_-6px_rgba(255,61,127,0.55)] hover:brightness-110 active:brightness-95",
  ghost:
    "bg-white/5 text-white hover:bg-white/10 border border-white/10",
  glass:
    "glass text-white hover:glass-hi",
  outline:
    "border border-white/15 text-white hover:bg-white/5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "flame", size = "md", fullWidth, children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
