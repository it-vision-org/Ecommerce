"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import BackButton from "@/components/ui/BackButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SpinnerIcon, ArrowLeftIcon } from "@/components/ui/Icons";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";

export default function ResetPasswordForm() {
  const t = useTranslations("ResetPasswordPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const features = [
    t("LeftPanel.Feature1"),
    t("LeftPanel.Feature2"),
    t("LeftPanel.Feature3"),
    t("LeftPanel.Feature4"),
  ];

  const strengthIsStrong = password.length >= 8;
  const strengthWidth = Math.min((password.length / 12) * 100, 100);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      toast.error(t("Form.Errors.NotMatch"));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(t("Form.Errors.Success"));
        setTimeout(() => router.push("/auth/login"), 1500);
      } else {
        toast.error(result?.message || t("Form.Errors.Failed"));
      }
    } catch (error) {
      toast.error(t("Form.Errors.ServerError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shield icon for left panel
  const shieldIcon = (
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
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
        title={`${t("LeftPanel.TitleLine1")}\n${t("LeftPanel.TitleLine2")}`}
        subtitle={t("LeftPanel.Subtitle")}
        features={features}
        icon={shieldIcon}
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

        {/* Back Button (Mobile) */}
        <div
          className={`absolute top-6 z-20 lg:hidden ${isRTL ? "right-6" : "left-6"}`}
        >
          <BackButton color="var(--primary)" path="/auth/login" />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-[440px] relative z-10 animate-card-in py-4">
          {/* Mobile logo */}
          <div
            className={`flex items-center gap-3 mb-6 lg:hidden ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              }}
            >
              {shieldIcon}
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {t("LeftPanel.TitleLine1")} {t("LeftPanel.TitleLine2")}
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`text-[2rem] font-bold mb-2 ${isRTL ? "text-right" : ""}`}
            style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          >
            {t("Form.Title")}
          </h2>

          <div
            className={`w-10 h-[2.5px] mb-3 rounded-full ${isRTL ? "mr-0 ml-auto" : ""}`}
            style={{
              background:
                "linear-gradient(90deg, var(--primary), var(--accent))",
            }}
          />

          <p
            className={`text-[0.9rem] mb-7 ${isRTL ? "text-right" : ""}`}
            style={{ color: "var(--text-secondary)" }}
          >
            {t("Form.Subtitle")}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="animate-field-in delay-100">
              <PasswordInput
                id="password"
                name="password"
                required
                isRTL={isRTL}
                label={t("Form.NewPassword")}
                placeholder={t("Form.PlaceholderNew")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="animate-field-in delay-150">
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                required
                isRTL={isRTL}
                label={t("Form.ConfirmPassword")}
                placeholder={t("Form.PlaceholderConfirm")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <p
                className={`mt-1.5 text-[0.78rem] flex items-start gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                style={{ color: "var(--text-muted)" }}
              >
                <span style={{ color: "var(--primary)" }}>*</span>
                <span>{t("Form.PasswordsMustMatch")}</span>
              </p>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="animate-field-in delay-200">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[0.78rem] font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t("Form.PasswordStrength")}
                  </span>
                  <span
                    className="text-[0.78rem] font-semibold"
                    style={{
                      color: strengthIsStrong
                        ? "var(--success)"
                        : "var(--text-muted)",
                    }}
                  >
                    {strengthIsStrong ? t("Form.Strong") : t("Form.Weak")}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--border)" }}
                >
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${strengthWidth}%`,
                      background: strengthIsStrong
                        ? "linear-gradient(90deg, var(--success), var(--accent))"
                        : "linear-gradient(90deg, var(--primary-300), var(--primary))",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-[0.92rem] text-white transition-all duration-200 mt-2 disabled:opacity-55 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                boxShadow: "0 4px 16px rgba(14,165,233,0.25)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon />
                  {t("Form.Resetting")}
                </span>
              ) : (
                t("Form.ResetButton")
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
            <span
              className="text-[0.75rem] font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {t("Form.Or")}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
          </div>

          {/* Back to login */}
          <div className={`${isRTL ? "text-right" : "text-center"}`}>
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className={`text-[0.9rem] font-semibold relative inline-flex items-center gap-2 transition-colors duration-200 group bg-transparent border-none cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}
              style={{ color: "var(--primary)" }}
            >
              <ArrowLeftIcon className={isRTL ? "rotate-180" : ""} />
              {t("Form.BackToLogin")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
