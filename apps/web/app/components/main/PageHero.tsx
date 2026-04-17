"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
interface StatPill {
  value: string | number;
  label: string;
}

interface PageHeroProps {
  badge: string;
  badgeIcon?: ReactNode;
  title: string;
  highlight?: string;
  description: string;
  stats?: StatPill[];
  accentColor?: string;
}

export default function PageHero({
  badge,
  badgeIcon,
  title,
  highlight,
  description,
  stats,
  accentColor = "text-[#fbbf24]",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0ea5e9] text-white">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--primary)]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-4"
        >
          {badgeIcon && (badgeIcon)}
          <motion.span>{badge}</motion.span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ color: "white" }}>
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/80 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
        {stats && stats.length > 0 && (
          <motion.div className="mt-8 flex flex-wrap justify-center gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur"
              >
                <motion.p className="text-2xl font-bold text-white">{stat.value}</motion.p>
                <motion.p className="text-xs text-slate-300 mt-0.5">{stat.label}</motion.p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section >
  );
}
