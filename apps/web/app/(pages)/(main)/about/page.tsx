import { getLocale, getTranslations } from "next-intl/server";
import PageHero from "@/components/main/PageHero";

import PrimaryButton from "@/components/ui/PrimaryButton";
import {
  Sparkles,
  Fish,
  UtensilsCrossed,
  Package,
  ShieldCheck,
  Truck,
  Globe,
  User,
  Building2,
  Store,
} from "lucide-react";

function SectionBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0f2fe] text-[#0369a1] text-sm font-semibold border border-[#bae6fd]">
      {label}
    </span>
  );
}

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");
  const locale = await getLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  const heroStats = [
    { value: t("Hero.Stat1") },
    { value: t("Hero.Stat2") },
    { value: t("Hero.Stat3") },
  ];

  const offerings = [
    {
      icon: Fish,
      title: t("Offerings.Item1.Title"),
      description: t("Offerings.Item1.Description"),
    },
    {
      icon: UtensilsCrossed,
      title: t("Offerings.Item2.Title"),
      description: t("Offerings.Item2.Description"),
    },
    {
      icon: Package,
      title: t("Offerings.Item3.Title"),
      description: t("Offerings.Item3.Description"),
    },
  ];

  const commitments = [
    { icon: ShieldCheck, text: t("Commitments.Item1") },
    { icon: Truck, text: t("Commitments.Item2") },
    { icon: Globe, text: t("Commitments.Item3") },
  ];

  const audiences = [
    {
      icon: User,
      title: t("Audience.Individual.Title"),
      description: t("Audience.Individual.Description"),
    },
    {
      icon: Building2,
      title: t("Audience.Restaurant.Title"),
      description: t("Audience.Restaurant.Description"),
    },
    {
      icon: Store,
      title: t("Audience.Wholesale.Title"),
      description: t("Audience.Wholesale.Description"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={direction}>
      {/* Hero */}
      <PageHero
        badge={t("Hero.Badge")}
        badgeIcon={<Sparkles className="w-4 h-4 text-[#d4a853]" />}
        title={t("Hero.Title")}
        highlight={t("Hero.Highlight")}
        description={t("Hero.Description")}
        stats={heroStats}
        accentColor="text-[#d4a853]"
      />

      {/* Story */}
      <section className="py-16 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className={isRTL ? "text-right" : ""}>
            <SectionBadge label={t("Story.Badge")} />
            <h2 className="mt-4 text-3xl font-bold text-[#0c4a6e]">
              {t("Story.Title")}
            </h2>
            <p className="mt-4 text-[#475569] leading-relaxed">
              {t("Story.Paragraph1")}
            </p>
            <p className="mt-3 text-[#475569] leading-relaxed">
              {t("Story.Paragraph2")}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] text-white shadow-lg">
            <p className="text-sm uppercase tracking-wider text-slate-200">
              {t("Commitments.Badge")}
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">
              {t("Commitments.Title")}
            </h3>
            <ul className="mt-5 space-y-3">
              {commitments.map((item) => (
                <li
                  key={item.text}
                  className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <item.icon className="w-5 h-5 text-[#d4a853] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-100">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-16 bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-10 ${isRTL ? "text-right" : ""}`}>
            <SectionBadge label={t("Offerings.Badge")} />
            <h2 className="mt-4 text-3xl font-bold text-[#0c4a6e]">
              {t("Offerings.Title")}
            </h2>
            <p className="mt-2 text-[#475569]">{t("Offerings.Subtitle")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item) => (
              <div
                key={item.title}
                className={`p-6 rounded-2xl border border-[#e2e8f0] bg-white hover:-translate-y-1 hover:shadow-lg transition-all ${isRTL ? "text-right" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#0c4a6e]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#475569]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-10 ${isRTL ? "text-right" : ""}`}>
            <SectionBadge label={t("Audience.Badge")} />
            <h2 className="mt-4 text-3xl font-bold text-[#0c4a6e]">
              {t("Audience.Title")}
            </h2>
            <p className="mt-2 text-[#475569]">{t("Audience.Subtitle")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {audiences.map((item) => (
              <div
                key={item.title}
                className={`p-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] ${isRTL ? "text-right" : ""}`}
              >
                <item.icon className="w-6 h-6 text-[#0369a1]" />
                <h3 className="mt-3 font-semibold text-[#0c4a6e]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#475569]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-3xl border border-[#bae6fd] bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] text-center">
            <h3 className="text-2xl font-bold text-[#0c4a6e]">
              {t("CTA.Title")}
            </h3>
            <p className="mt-3 text-[#475569] max-w-2xl mx-auto">
              {t("CTA.Description")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <PrimaryButton as="link" href="/products">
                {t("CTA.ButtonProducts")}
              </PrimaryButton>

              <PrimaryButton as="link" href="/contact" variant="outline">
                {t("CTA.ButtonContact")}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
