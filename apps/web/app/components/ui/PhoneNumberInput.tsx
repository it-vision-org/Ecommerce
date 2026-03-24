import { Dispatch, SetStateAction } from "react";

// Define the FormData type (adjust this to match your actual form data structure)
interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  userType: string;
}

import { useTranslations, useLocale } from "next-intl";

// Define the component props
interface PhoneNumberInputProps {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
}

export function PhoneNumberInput({
  formData,
  setFormData,
}: PhoneNumberInputProps) {
  const t = useTranslations("SignupPage");
  const locale = useLocale();

  // Check if current locale is RTL (Arabic)
  const isRTL = locale === "ar";

  return (
    <>
      {/* Phone Number */}
      <div className="animate-field-in delay-250">
        <label
          htmlFor="phoneNumber"
          className="block text-[0.85rem] font-semibold mb-[0.4rem]"
          style={{ color: "var(--color-neutral-700)" /* Orange: #44403c */ }}
        >
          {t("Form.PhoneLabel")}{" "}
          <span
            style={{
              fontWeight: 400,
              color: "var(--color-neutral-500)" /* Orange: #78716c */,
            }}
          >
            {t("Form.PhoneOptional")}
          </span>
        </label>
        <div className="relative flex">
          {/* Country Code Selector */}
          <div className="relative">
            <select
              value={formData.countryCode}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  countryCode: e.target.value,
                  phoneNumber: "", // Clear phone number when country changes
                }));
              }}
              className={`appearance-none h-full py-[0.85rem] pl-3 pr-9 text-[0.9rem] bg-white transition-all duration-300 outline-none cursor-pointer font-medium ${
                isRTL ? "rounded-r-xl" : "rounded-l-xl"
              }`}
              style={{
                border: "2px solid var(--color-primary-100)",
                ...(isRTL ? { borderLeft: "none" } : { borderRight: "none" }),
              }}
              onFocus={(e) => {
                e.target.style.borderColor =
                  "var(--color-primary-400)"; /* Orange: #fb923c */
                e.target.style.boxShadow =
                  "0 0 0 4px rgba(59, 130, 246, 0.1)"; /* Orange: rgba(251, 146, 60, 0.1) */
                const input = document.getElementById(
                  "phoneNumber",
                ) as HTMLInputElement;
                if (input) {
                  input.style.borderColor = "var(--color-primary-400)";
                  input.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-primary-100)";
                e.target.style.boxShadow = "none";
                const input = document.getElementById(
                  "phoneNumber",
                ) as HTMLInputElement;
                if (input) {
                  input.style.borderColor = "var(--color-primary-100)";
                  input.style.boxShadow = "none";
                }
              }}
            >
              <option value="+216">🇹🇳 +216</option>
              <option value="+1">🇨🇦 +1</option>
            </select>
            {/* Dropdown Arrow */}
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                color: "var(--color-neutral-400)" /* Orange: #a8a29e */,
              }}
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

          {/* Divider */}
          <div
            className="w-px self-stretch my-2"
            style={{
              background: "var(--color-primary-200)" /* Orange: #fed7aa */,
            }}
          />

          {/* Phone Input */}
          <div className="relative flex-1">
            <svg
              className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? "right-3" : "left-3"
              }`}
              style={{
                color: "var(--color-neutral-400)" /* Orange: #a8a29e */,
              }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              className={`w-full py-[0.85rem] text-[0.95rem] bg-white transition-all duration-300 outline-none ${
                isRTL
                  ? "pr-10 pl-4 rounded-l-xl text-right"
                  : "pl-10 pr-4 rounded-r-xl"
              }`}
              style={{
                border: "2px solid var(--color-primary-100)",
                ...(isRTL ? { borderRight: "none" } : { borderLeft: "none" }),
              }}
              placeholder={
                formData.countryCode === "+216"
                  ? "__ ___ ___"
                  : "(___) ___-____"
              }
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value;

                if (formData.countryCode === "+216") {
                  // Tunisia format: XX XXX XXX (8 digits)
                  const cleaned = value.replace(/\D/g, "").slice(0, 8);
                  let formatted = "";

                  if (cleaned.length > 0) {
                    formatted = cleaned.slice(0, 2);
                    if (cleaned.length > 2) {
                      formatted += " " + cleaned.slice(2, 5);
                    }
                    if (cleaned.length > 5) {
                      formatted += " " + cleaned.slice(5, 8);
                    }
                  }

                  setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
                } else if (formData.countryCode === "+1") {
                  // Canada/US format: (XXX) XXX-XXXX (10 digits)
                  const cleaned = value.replace(/\D/g, "").slice(0, 10);
                  let formatted = "";

                  if (cleaned.length > 0) {
                    formatted = "(" + cleaned.slice(0, 3);
                    if (cleaned.length > 3) {
                      formatted += ") " + cleaned.slice(3, 6);
                    }
                    if (cleaned.length > 6) {
                      formatted += "-" + cleaned.slice(6, 10);
                    }
                  }

                  setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
                }
              }}
              onFocus={(e) => {
                e.target.style.borderColor =
                  "var(--color-primary-400)"; /* Orange: #fb923c */
                e.target.style.boxShadow =
                  "0 0 0 4px rgba(59, 130, 246, 0.1)"; /* Orange: rgba(251, 146, 60, 0.1) */
                const select = e.target
                  .closest(".relative.flex")
                  ?.querySelector("select") as HTMLSelectElement;
                if (select) {
                  select.style.borderColor = "var(--color-primary-400)";
                  select.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-primary-100)";
                e.target.style.boxShadow = "none";
                const select = e.target
                  .closest(".relative.flex")
                  ?.querySelector("select") as HTMLSelectElement;
                if (select) {
                  select.style.borderColor = "var(--color-primary-100)";
                  select.style.boxShadow = "none";
                }
              }}
            />
          </div>
        </div>

        {/* Helper Text */}
        {formData.phoneNumber && (
          <p
            className="mt-2 text-xs flex items-center gap-1"
            style={{ color: "var(--color-neutral-500)" /* Orange: #78716c */ }}
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
              style={{
                color: "var(--color-primary-600)" /* Orange: #ea580c */,
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>
              {formData.countryCode} {formData.phoneNumber}
            </span>
          </p>
        )}
      </div>

      {/* Add styling for select options */}
      <style jsx>{`
        select option {
          padding: 12px 16px;
          font-size: 15px;
          font-weight: 500;
          color: var(--color-neutral-800); /* Orange: #292524 */
          background-color: white;
        }

        select option:hover {
          background-color: var(--color-primary-50); /* Orange: #fff7ed */
          color: var(--color-primary-700); /* Orange: #c2410c */
        }

        select option:checked {
          background-color: var(--color-primary-100); /* Orange: #ffedd5 */
          color: var(--color-primary-700); /* Orange: #c2410c */
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
