import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import {
  Eye,
  Target,
  Heart,
  Crown,
  Users,
  Sparkles,
  Star,
  BookOpen,
  Shield,
  Lightbulb,
  Globe,
  UserCircle2,
} from "lucide-react";
import { getFounders, getCurrentYearMembers } from "@/actions/AboutActions";
import { ClubMemberData } from "@/types";
import { getCurrentSchoolYear } from "@/lib/utils";

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0f2fe] text-[#0369a1] text-sm font-semibold">
      {label}
    </span>
  );
}

function RoleTag({ role }: { role: string }) {
  return (
    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#0369a1]">
      {role}
    </span>
  );
}

function MemberAvatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-base",
    lg: "w-16 h-16 text-lg",
  };

  if (image) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-2xl overflow-hidden flex-shrink-0 relative`}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {initials || <UserCircle2 className="w-5 h-5" />}
    </div>
  );
}

function FounderCard({
  member,
  description,
  isRTL,
}: {
  member: ClubMemberData;
  description: string;
  isRTL: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-2xl border border-[#e2e8f0] bg-white hover:-translate-y-1 hover:shadow-lg transition-all ${isRTL ? "text-right" : ""}`}
    >
      <div
        className={`flex items-center gap-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <MemberAvatar name={member.name} image={member.image} size="md" />
        <div>
          <p className="font-bold text-[#0f172a]">{member.name}</p>
          <RoleTag role={member.role} />
        </div>
      </div>
      <p className="text-sm text-[#475569] leading-relaxed">{description}</p>
    </div>
  );
}

function MemberCard({
  member,
  isRTL,
}: {
  member: ClubMemberData;
  isRTL: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:-translate-y-1 hover:shadow-md transition-all ${isRTL ? "text-right" : ""}`}
    >
      <div
        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <MemberAvatar name={member.name} image={member.image} size="sm" />
        <div>
          <p className="font-semibold text-[#0f172a] text-sm">{member.name}</p>
          <RoleTag role={member.role} />
        </div>
      </div>
    </div>
  );
}

// ─── Page (Server Component) ───────────────────────────────────────────────────

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");
  const locale = await getLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  // Parallel DB fetch
  const [foundersResult, membersResult] = await Promise.all([
    getFounders(),
    getCurrentYearMembers(),
  ]);

  const founders = foundersResult.data ?? [];
  const currentMembers = membersResult.data ?? [];
  const schoolYear = getCurrentSchoolYear();

  // Static translated data
  const visionPillars = [
    {
      icon: Lightbulb,
      title: t("Vision.Pillar1.Title"),
      description: t("Vision.Pillar1.Description"),
    },
    {
      icon: Globe,
      title: t("Vision.Pillar2.Title"),
      description: t("Vision.Pillar2.Description"),
    },
    {
      icon: Heart,
      title: t("Vision.Pillar3.Title"),
      description: t("Vision.Pillar3.Description"),
    },
  ];

  const missionPoints = [
    t("Mission.Point1"),
    t("Mission.Point2"),
    t("Mission.Point3"),
    t("Mission.Point4"),
  ];

  const values = [
    {
      icon: Shield,
      title: t("Values.Value1.Title"),
      description: t("Values.Value1.Description"),
      bg: "bg-[#e0f2fe]",
      text: "text-[#0369a1]",
    },
    {
      icon: Heart,
      title: t("Values.Value2.Title"),
      description: t("Values.Value2.Description"),
      bg: "bg-[#fce7f3]",
      text: "text-[#9d174d]",
    },
    {
      icon: Users,
      title: t("Values.Value3.Title"),
      description: t("Values.Value3.Description"),
      bg: "bg-[#dcfce7]",
      text: "text-[#166534]",
    },
    {
      icon: Star,
      title: t("Values.Value4.Title"),
      description: t("Values.Value4.Description"),
      bg: "bg-[#fef9c3]",
      text: "text-[#854d0e]",
    },
    {
      icon: BookOpen,
      title: t("Values.Value5.Title"),
      description: t("Values.Value5.Description"),
      bg: "bg-[#f3e8ff]",
      text: "text-[#6b21a8]",
    },
    {
      icon: Sparkles,
      title: t("Values.Value6.Title"),
      description: t("Values.Value6.Description"),
      bg: "bg-[#ffedd5]",
      text: "text-[#9a3412]",
    },
  ];

  // Founder descriptions come from translation keys (bio text is editorial, not DB)
  const founderDescriptions = [
    t("Founders.Member1.Description"),
    t("Founders.Member2.Description"),
    t("Founders.Member3.Description"),
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={direction}>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#38bdf8,transparent_30%),radial-gradient(circle_at_80%_10%,#3b82f6,transparent_30%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur mb-6">
            <Sparkles className="w-4 h-4 text-[#bae6fd]" />
            <span className="text-sm font-medium">{t("Hero.Badge")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t("Hero.Title")}{" "}
            <span className="text-[#fbbf24]">{t("Hero.Highlight")}</span>
          </h1>
          <p className="mt-5 text-lg text-slate-200 max-w-2xl mx-auto">
            {t("Hero.Description")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { value: t("Hero.Stat1.Value"), label: t("Hero.Stat1.Label") },
              { value: t("Hero.Stat2.Value"), label: t("Hero.Stat2.Label") },
              { value: t("Hero.Stat3.Value"), label: t("Hero.Stat3.Label") },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur"
              >
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`mb-12 ${isRTL ? "text-right" : ""}`}>
            <SectionBadge label={t("Vision.Badge")} />
            <h2 className="mt-3 text-3xl font-bold text-[#0f172a]">
              {t("Vision.Title")}
            </h2>
            <p className="mt-3 text-[#475569] max-w-2xl">
              {t("Vision.Subtitle")}
            </p>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] text-white shadow-xl">
              <Eye className="w-10 h-10 text-[#bae6fd] mb-4" />
              <p className="text-lg font-semibold leading-relaxed">
                {t("Vision.Statement")}
              </p>
              <p className="mt-4 text-sm text-slate-300">
                {t("Vision.SubStatement")}
              </p>
            </div>
            <div className="space-y-4">
              {visionPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className={`p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] flex gap-4 items-start ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <div className="p-2.5 rounded-xl bg-[#e0f2fe] flex-shrink-0">
                    <pillar.icon className="w-5 h-5 text-[#0369a1]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">
                      {pillar.title}
                    </p>
                    <p className="mt-1 text-sm text-[#475569]">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 bg-[#f8fafc] border-y border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionBadge label={t("Mission.Badge")} />
            <h2 className="mt-3 text-3xl font-bold text-[#0f172a]">
              {t("Mission.Title")}
            </h2>
            <p className="mt-3 text-[#475569] max-w-2xl mx-auto">
              {t("Mission.Subtitle")}
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-4">
              {missionPoints.map((point, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border border-[#e2e8f0] bg-white flex gap-4 items-start ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-[#334155] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
            <div
              className={`p-7 rounded-3xl border border-[#e2e8f0] bg-white shadow-sm ${isRTL ? "text-right" : ""}`}
            >
              <div
                className={`flex items-center gap-3 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Target className="w-6 h-6 text-[#2563eb]" />
                <p className="font-bold text-[#0f172a]">
                  {t("Mission.CardTitle")}
                </p>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">
                {t("Mission.CardDescription")}
              </p>
              <div className="mt-5 pt-5 border-t border-[#e2e8f0]">
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-3">
                  {t("Mission.AudienceLabel")}
                </p>
                <div
                  className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}
                >
                  {[
                    t("Mission.Audience.Students"),
                    t("Mission.Audience.Teachers"),
                    t("Mission.Audience.Parents"),
                  ].map((a) => (
                    <span
                      key={a}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#0369a1]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionBadge label={t("Values.Badge")} />
            <h2 className="mt-3 text-3xl font-bold text-[#0f172a]">
              {t("Values.Title")}
            </h2>
            <p className="mt-3 text-[#475569] max-w-2xl mx-auto">
              {t("Values.Subtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className={`p-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:-translate-y-1 hover:shadow-lg transition-all ${isRTL ? "text-right" : ""}`}
              >
                <div
                  className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className={`p-2.5 rounded-xl ${value.bg} flex-shrink-0`}>
                    <value.icon className={`w-5 h-5 ${value.text}`} />
                  </div>
                  <h3 className="font-bold text-[#0f172a]">{value.title}</h3>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founders (DB) ── */}
      <section className="py-20 bg-[#f8fafc] border-y border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionBadge label={t("Founders.Badge")} />
            <h2 className="mt-3 text-3xl font-bold text-[#0f172a]">
              {t("Founders.Title")}
            </h2>
            <p className="mt-3 text-[#475569] max-w-2xl mx-auto">
              {t("Founders.Subtitle")}
            </p>
          </div>

          {founders.length === 0 ? (
            <p className="text-center text-[#94a3b8] py-10">
              {t("Founders.Empty")}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {founders.map((founder, idx) => (
                <FounderCard
                  key={founder.id}
                  member={founder}
                  description={founderDescriptions[idx] ?? ""}
                  isRTL={isRTL}
                />
              ))}
            </div>
          )}

          <div
            className={`mt-10 p-6 rounded-2xl border border-[#e2e8f0] bg-white flex gap-4 items-start max-w-2xl mx-auto ${isRTL ? "flex-row-reverse text-right" : ""}`}
          >
            <Crown className="w-6 h-6 text-[#f59e0b] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#0f172a]">
                {t("Founders.NoteTitle")}
              </p>
              <p className="mt-1 text-sm text-[#475569]">
                {t("Founders.NoteDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Current Year Members (DB) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionBadge label={t("Members.Badge")} />
            <h2 className="mt-3 text-3xl font-bold text-[#0f172a]">
              {t("Members.Title")}
            </h2>
            <p className="mt-3 text-[#475569] max-w-2xl mx-auto">
              {t("Members.Subtitle")}
            </p>
          </div>

          {currentMembers.length === 0 ? (
            <p className="text-center text-[#94a3b8] py-10">
              {t("Members.Empty")}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentMembers.map((member) => (
                <MemberCard key={member.id} member={member} isRTL={isRTL} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <div className="inline-block p-6 rounded-2xl border border-[#e2e8f0] bg-gradient-to-br from-[#eff6ff] to-[#e0f2fe]">
              <p className="text-sm font-semibold text-[#1e40af] flex items-center gap-2 justify-center">
                <Users className="w-4 h-4" />
                {t("Members.SchoolYear", { year: schoolYear })}
              </p>
              <p className="mt-1 text-xs text-[#475569]">
                {t("Members.SchoolYearNote")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
