"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, useTranslations } from "next-intl";
import { useCallback } from "react";
import { LanguageSelector } from "./LanguageSelector";

type Props = {
  changeLocaleAction?: (locale: Locale) => Promise<void>;
};

export function AuthNavbar({ changeLocaleAction }: Props) {
  const pathname = usePathname();
  const t = useTranslations("AuthNavbar");


  // Don't render if not on an auth page
  const isAuth = pathname.includes("/auth");
  if (!isAuth) return null;

  const handleLocaleChange = useCallback(
    async (nextLocale: Locale) => {
      if (changeLocaleAction) {
        await changeLocaleAction(nextLocale);
      } else {
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/;`;
        window.location.reload();
      }
    },
    [changeLocaleAction],
  );

  return (
    <header
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        {/* Left side (logo reserved) */}
        <div
          className="group flex items-center gap-3 transition-all duration-300"
          aria-label="Go to homepage"
        ></div>

        {/* Right side */}
        <div
          className="flex items-center gap-3 "
        >
          <LanguageSelector changeLocaleAction={handleLocaleChange} />

          <div
            className="hidden h-5 w-px sm:block"
            style={{ background: "var(--color-primary-200)" }}
          />

          <Link
            href="/"
            className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 100%)",
              color: "white",
              boxShadow: "0 2px 10px rgba(59,130,246,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(59,130,246,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 10px rgba(59,130,246,0.25)";
            }}
          >
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className="hidden sm:inline">{t("Home")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
