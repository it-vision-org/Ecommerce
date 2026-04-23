"use client";

import type { Dispatch, SetStateAction } from "react";
import { useLocale, useTranslations } from "next-intl";

export type PhoneNumberFormState = {
  phoneNumber: string;
  countryCode: string;
};

type PhoneNumberInputProps<T extends PhoneNumberFormState> = {
  formData: T;
  setFormData: Dispatch<SetStateAction<T>>;
  label?: string;
  optionalText?: string;
  showOptionalText?: boolean;
  className?: string;
  inputId?: string;
  disabled?: boolean;
};

const SUPPORTED_CODES = ["+216", "+1"] as const;

function isSupportedCode(code: string): code is (typeof SUPPORTED_CODES)[number] {
  return SUPPORTED_CODES.includes(code as (typeof SUPPORTED_CODES)[number]);
}

function formatPhoneNumber(value: string, countryCode: string): string {
  if (countryCode === "+216") {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);

    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)}`;
  }

  const cleaned = value.replace(/\D/g, "").slice(0, 10);

  if (cleaned.length === 0) return "";
  if (cleaned.length <= 3) return `(${cleaned}`;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

export function PhoneNumberInput<T extends PhoneNumberFormState>({
  formData,
  setFormData,
  label,
  optionalText,
  showOptionalText = true,
  className = "",
  inputId = "phoneNumber",
  disabled = false,
}: PhoneNumberInputProps<T>) {
  const t = useTranslations("SignupPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const resolvedLabel = label ?? t("Form.PhoneLabel");
  const resolvedOptionalText = optionalText ?? t("Form.PhoneOptional");
  const activeCountryCode = isSupportedCode(formData.countryCode)
    ? formData.countryCode
    : "+216";

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="block text-[0.85rem] font-semibold mb-[0.4rem]"
        style={{ color: "var(--color-neutral-700)" }}
      >
        {resolvedLabel}{" "}
        {showOptionalText ? (
          <span style={{ fontWeight: 400, color: "var(--color-neutral-500)" }}>
            {resolvedOptionalText}
          </span>
        ) : null}
      </label>

      <div className="relative flex" data-phone-input-root="true">
        <div className="relative">
          <select
            value={activeCountryCode}
            disabled={disabled}
            onChange={(e) => {
              const nextCode = e.target.value;
              setFormData((prev) => ({
                ...prev,
                countryCode: nextCode,
                phoneNumber: "",
              }));
            }}
            className={
              "appearance-none h-full py-3 pl-3 pr-9 text-[0.92rem] bg-white transition-all duration-300 outline-none cursor-pointer font-medium " +
              (isRTL ? "rounded-r-xl" : "rounded-l-xl")
            }
            style={{
              border: "1px solid var(--color-primary-100)",
              ...(isRTL ? { borderLeft: "none" } : { borderRight: "none" }),
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-primary-400)";
              e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.1)";
              const input = document.getElementById(inputId) as HTMLInputElement | null;
              if (input) {
                input.style.borderColor = "var(--color-primary-400)";
                input.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.1)";
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-primary-100)";
              e.target.style.boxShadow = "none";
              const input = document.getElementById(inputId) as HTMLInputElement | null;
              if (input) {
                input.style.borderColor = "var(--color-primary-100)";
                input.style.boxShadow = "none";
              }
            }}
          >
            <option value="+216">🇹🇳 +216</option>
            <option value="+1">🇨🇦 +1</option>
          </select>

          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-neutral-400)" }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <div
          style={{
            background: "var(--border)",
            width: "1px",
            alignSelf: "stretch",
            margin: "0.5rem 0.1rem",
          }}
        />

        <div className="relative flex-1">
          <svg
            className={
              "absolute top-1/2 -translate-y-1/2 pointer-events-none " +
              (isRTL ? "right-3" : "left-3")
            }
            style={{ color: "var(--color-neutral-400)" }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>

          <input
            id={inputId}
            name="phoneNumber"
            type="tel"
            inputMode="numeric"
            disabled={disabled}
            className={
              "w-full py-3 text-[0.92rem] bg-white transition-all duration-300 outline-none " +
              (isRTL ? "pr-10 pl-4 rounded-l-xl text-right" : "pl-10 pr-4 rounded-r-xl")
            }
            style={{
              border: "1px solid var(--color-primary-100)",
              ...(isRTL ? { borderRight: "none" } : { borderLeft: "none" }),
            }}
            placeholder={activeCountryCode === "+216" ? "__ ___ ___" : "(___) ___-____"}
            value={formData.phoneNumber}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value, activeCountryCode);
              setFormData((prev) => ({
                ...prev,
                phoneNumber: formatted,
              }));
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-primary-500)";
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              const select = e.currentTarget
                .closest('[data-phone-input-root="true"]')
                ?.querySelector("select") as HTMLSelectElement | null;
              if (select) {
                select.style.borderColor = "var(--color-primary-500)";
                select.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.boxShadow = "none";
              const select = e.currentTarget
                .closest('[data-phone-input-root="true"]')
                ?.querySelector("select") as HTMLSelectElement | null;
              if (select) {
                select.style.borderColor = "var(--border)";
                select.style.boxShadow = "none";
              }
            }}
          />
        </div>
      </div>

      {formData.phoneNumber ? (
        <p
          className="mt-2 text-xs flex items-center gap-1"
          style={{ color: "var(--color-neutral-500)" }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--color-primary-600)" }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>
            {activeCountryCode} {formData.phoneNumber}
          </span>
        </p>
      ) : null}

      <style jsx>{`
        select option {
          padding: 12px 16px;
          font-size: 15px;
          font-weight: 500;
          color: var(--color-neutral-800);
          background-color: white;
        }

        select option:hover {
          background-color: var(--color-primary-50);
          color: var(--color-primary-700);
        }

        select option:checked {
          background-color: var(--color-primary-100);
          color: var(--color-primary-700);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}