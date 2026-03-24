import { ReactNode } from "react";

interface StatPill {
  value: string | number;
  label: string;
}

interface PageHeroProps {
  badge: string;
  badgeIcon: ReactNode;
  title: string;
  highlight: string;
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] text-white">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#38bdf8,transparent_30%),radial-gradient(circle_at_80%_10%,#fbbf24,transparent_30%)]" />
      <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur mb-6">
          {badgeIcon}
          <span className="text-sm font-medium">{badge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {title} <span className={accentColor}>{highlight}</span>
        </h1>
        <p className="mt-5 text-lg text-slate-200 max-w-2xl mx-auto">
          {description}
        </p>
        {stats && stats.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
