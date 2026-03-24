"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Locale, useTranslations } from "next-intl";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { LanguageSelector } from "./LanguageSelector";

type User = {
  name?: string | null;
  email?: string | null;
  profileImage?: string | null;
} | null;

const NAV_ITEMS = [
  { href: "/", key: "Home" },
  { href: "/library", key: "Library" },
  { href: "/events", key: "Events" },
  { href: "/achievements", key: "Achievements" },
  { href: "/contact", key: "Contact" },
  { href: "/about", key: "About" },
];

const HIDE_PATHS = [""];

export function AppHeader({
  user,
  changeLocaleAction,
}: {
  user: User;
  changeLocaleAction?: (locale: Locale) => Promise<void>;
}) {
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuth = pathname.startsWith("/auth");
  const shouldHide = isAuth || HIDE_PATHS.includes(pathname);
  if (shouldHide) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, []);

  const avatarInitial = (user?.name || user?.email || t("MemberFallback"))
    .charAt(0)
    .toUpperCase();

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

  const dropdownPosition = "right-0";

  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-base font-bold">
            S
          </span>
          <div className="leading-tight">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
              Spark
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-full px-3 py-2 text-sm font-medium transition",
                "hover:text-blue-700 hover:bg-blue-50",
                isActive(item.href)
                  ? "text-blue-700 bg-blue-50 border border-blue-100 shadow-xs"
                  : "text-slate-700",
              ].join(" ")}
            >
              {t(`NavItems.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div
          className="flex items-center gap-3"
        >
          <LanguageSelector changeLocaleAction={handleLocaleChange} />

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm ring-2 ring-transparent transition hover:ring-blue-100"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || user.email || t("MemberFallback")}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-blue-700">
                    {avatarInitial}
                  </span>
                )}
              </button>

              {menuOpen && (
                <div
                  className={`absolute ${dropdownPosition} top-[calc(100%+10px)] w-72 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-blue-100/40 ring-1 ring-slate-100/60`}
                >
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50">
                    <div className="flex size-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name || user.email || t("MemberFallback")}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-base font-semibold text-blue-700">
                          {avatarInitial}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {user.name || t("MemberFallback")}
                      </div>
                      <div className="truncate text-xs text-slate-500">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 px-2 py-2">
                    <Link
                      href="/profile"
                      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("ProfileSettings")}
                    </Link>
                    <Link
                      href="/meetings"
                      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("Meetings")}
                    </Link>
                    <LogoutButton className="inline-flex w/full items-center justify-start rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <LoginButton className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" />
          )}
        </div>
      </div>
    </header>
  );
}
