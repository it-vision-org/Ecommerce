"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import BackButton from "@/components/ui/BackButton";
import { AuthInput } from "@/components/auth/AuthInput";
import {
  EmailIcon,
  ShoppingBagIcon,
  SpinnerIcon,
  ArrowLeftIcon,
} from "@/components/ui/Icons";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("ForgotPasswordPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("Toast.ErrorDefault"));
      }

      toast.success(t("Toast.Success"));
    } catch (err: any) {
      toast.error(err.message || t("Toast.ErrorGeneral"));
    } finally {
      setIsLoading(false);
    }
  };

  const features = ["Feature1", "Feature2", "Feature3", "Feature4"].map((key) =>
    t(`LeftPanel.Features.${key}`),
  );

  // Email icon for left panel
  const emailPanelIcon = (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Left Panel */}
      <AuthLeftPanel
        isRTL={isRTL}
        title={t("LeftPanel.Title")}
        subtitle={t("LeftPanel.Subtitle")}
        features={features}
        tagline={t("Brand")}
        icon={emailPanelIcon}
      />

      {/* Right Form Area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-y-auto px-8 py-8"
        style={{ background: "var(--bg)" }}
      >
        {/* Background decorations */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 80% 10%, rgba(14,165,233,0.06) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 90%, rgba(6,182,212,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Mobile accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] lg:hidden"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--primary), transparent)",
          }}
        />

        {/* Back Button (Mobile) */}
        <div
          className={`absolute top-6 z-20 lg:hidden ${isRTL ? "right-6" : "left-6"}`}
        >
          <BackButton color="var(--primary)" path="/auth/login" />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-[440px] relative z-10 animate-card-in py-4">
          {/* Mobile Logo */}
          <div
            className={`flex items-center gap-3 mb-7 lg:hidden ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              }}
            >
              <ShoppingBagIcon size={20} />
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {t("Brand")}
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`text-[2rem] mb-2 leading-tight font-bold ${isRTL ? "text-right" : ""}`}
            style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          >
            {t("Heading")}
          </h2>

          <div
            className={`w-10 h-[2.5px] mb-3 rounded-full ${isRTL ? "mr-0 ml-auto" : ""}`}
            style={{
              background:
                "linear-gradient(90deg, var(--primary), var(--accent))",
            }}
          />

          <p
            className={`text-[0.9rem] mb-7 font-normal leading-relaxed ${isRTL ? "text-right" : ""}`}
            style={{ color: "var(--text-secondary)" }}
          >
            {t("Subheading")}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="animate-field-in delay-100">
              <AuthInput
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                isRTL={isRTL}
                label={t("Form.EmailLabel")}
                icon={<EmailIcon />}
                placeholder={t("Form.EmailPlaceholder")}
                hint={t("Form.EmailHint")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-[0.92rem] transition-all duration-200 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(14,165,233,0.25)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon />
                  {t("Form.SubmittingButton")}
                </span>
              ) : (
                t("Form.SubmitButton")
              )}
            </button>
          </form>

          {/* Help box */}
          <div
            className="mt-6 p-4 rounded-xl"
            style={{
              background: "var(--primary-50)",
              border: "1px solid var(--primary-100)",
            }}
          >
            <p
              className={`text-[0.82rem] font-semibold mb-1 ${isRTL ? "text-right" : ""}`}
              style={{ color: "var(--primary-700)" }}
            >
              {t("HelpBox.Title")}
            </p>
            <p
              className={`text-[0.78rem] leading-relaxed ${isRTL ? "text-right" : ""}`}
              style={{ color: "var(--text-secondary)" }}
            >
              {t("HelpBox.Description")}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
            <span
              className="text-[0.75rem] uppercase tracking-[0.12em] font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {t("Divider")}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
          </div>

          {/* Back to login */}
          <div className={`text-center ${isRTL ? "text-right" : ""}`}>
            <Link
              href="/auth/login"
              className={`text-[0.9rem] font-semibold inline-flex items-center gap-2 transition-colors duration-200 ${isRTL ? "flex-row-reverse" : ""}`}
              style={{ color: "var(--primary)" }}
            >
              <ArrowLeftIcon className={isRTL ? "rotate-180" : ""} />
              {t("BackToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
