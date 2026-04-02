import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0ea5e9] text-white">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a853]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0ea5e9]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className={isRTL ? "text-right" : ""}>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Sparkles className="w-4 h-4 text-[#d4a853]" />
                <span className="text-sm font-medium">{t("Hero.Badge")}</span>
              </div>

              <h1
                className="mt-5 text-4xl md:text-5xl font-bold leading-tight"
                style={{ color: "white" }}
              >
                {t("Hero.Title")}{" "}
                <span className="text-[#d4a853]">{t("Hero.Highlight")}</span>
              </h1>

              <p className="mt-4 text-lg text-slate-200 max-w-2xl">
                {t("Hero.Description")}
              </p>

              <div
                className={`mt-6 flex flex-wrap gap-3 text-sm text-slate-200 ${isRTL ? "justify-end" : ""}`}
              >
                {[t("Hero.Stat1"), t("Hero.Stat2"), t("Hero.Stat3")].map(
                  (stat) => (
                    <span
                      key={stat}
                      className="px-3 py-2 rounded-full bg-white/10 border border-white/15"
                    >
                      {stat}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-lg shadow-xl">
              <div
                className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#d4a853]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#d4a853]" />
                </div>
                <div>
                  <p className="text-sm text-slate-200">
                    {t("Commitments.Badge")}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {t("Commitments.Title")}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {commitments.map((item) => (
                  <div
                    key={item.text}
                    className={`flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-[#7dd3fc]" />
                    </div>
                    <p className="text-white text-sm font-medium">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <h3 className="mt-2 text-xl font-bold" style={{ color: "white" }}>
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
