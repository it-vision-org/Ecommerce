"use client";

import { useEffect, useRef, useState } from "react";
import { Locale, useLocale } from "next-intl";

type Language = {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string; // emoji flag
};

const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇹🇳" },
];

type Props = {
  changeLocaleAction: (locale: Locale) => Promise<void>;
};

export function LanguageSelector({ changeLocaleAction }: Props) {
  const activeLocale = useLocale();
  const initialLang =
    LANGUAGES.find((lang) => lang.code === activeLocale) || LANGUAGES[0];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(initialLang);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLanguageSelect = async (language: Language) => {
    setSelectedLang(language);
    setIsOpen(false);
    await changeLocaleAction(language.code);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-gradient-to-br from-white/90 to-primary-50/50 px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary-300 hover:from-white hover:to-primary-100/80 hover:shadow-md focus:outline-none"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-xl leading-none transition-transform group-hover:scale-110">
          {selectedLang.flag}
        </span>
        <span className="font-bold uppercase tracking-wide">
          {selectedLang.code}
        </span>
        <svg
          className={`h-4 w-4 text-primary-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 animate-field-in overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xl shadow-blue-100/40 ring-1 ring-slate-100/60">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
              Select Language
            </p>
          </div>

          <div className="py-1">
            {LANGUAGES.map((language) => {
              const isSelected = language.code === selectedLang.code;

              return (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${
                    isSelected
                      ? "bg-gradient-to-r from-primary-100 to-accent-100"
                      : "hover:bg-primary-50"
                  }`}
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100 text-2xl shadow-sm">
                    {language.flag}
                  </span>

                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary-800" : "text-neutral-800"
                      }`}
                    >
                      {language.name}
                    </p>
                    <p
                      className={`text-xs ${
                        isSelected ? "text-primary-600" : "text-neutral-500"
                      } ${language.code === "ar" ? "text-right" : ""}`}
                    >
                      {language.nativeName}
                    </p>
                  </div>

                  {isSelected && (
                    <svg className="h-5 w-5 flex-shrink-0 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}