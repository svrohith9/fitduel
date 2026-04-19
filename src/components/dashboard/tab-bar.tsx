"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Swords, TrendingUp, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/duels", label: "Duels", icon: Swords },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/group", label: "Group", icon: Users },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-4 left-1/2 z-40 w-[min(560px,calc(100vw-24px))] -translate-x-1/2"
      aria-label="Primary"
    >
      <div className="glass-hi flex items-center justify-between rounded-full p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
        {tabs.map((t) => {
          const active =
            t.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-2 text-[11px] font-medium transition-colors",
                active ? "text-white" : "text-text-muted hover:text-text",
              )}
            >
              {active && (
                <motion.span
                  layoutId="tab-active"
                  className="bg-flame absolute inset-0 -z-10 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <t.icon className="h-5 w-5" />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
