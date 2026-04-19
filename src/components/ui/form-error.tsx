"use client";

import { motion } from "framer-motion";

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
    >
      {message}
    </motion.div>
  );
}
