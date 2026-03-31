"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import BackButton from "@/components/ui/BackButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { EmailIcon, ShoppingBagIcon, SpinnerIcon } from "@/components/ui/Icons";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("LoginPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success(t("Toast.Success"));
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      toast.error(err.message || t("Toast.Error"));
    } finally {
      setIsLoading(false);
    }
  };

  const features = ["Feature1", "Feature2", "Feature3", "Feature4"].map((key) =>
    t(`LeftPanel.Features.${key}`),
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
        icon={<ShoppingBagIcon size={38} />}
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
          <BackButton color="var(--primary)" path="/" />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-[440px] relative z-10 animate-card-in py-4">
          {/* Mobile Logo */}
          <div
            className={`flex items-center gap-3 mb-7 lg:hidden ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
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
            className={`text-[0.9rem] mb-7 font-normal ${isRTL ? "text-right" : ""}`}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="animate-field-in delay-150">
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                required
                isRTL={isRTL}
                label={t("Form.PasswordLabel")}
                placeholder={t("Form.PasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Forgot Password */}
            <div
              className={`animate-field-in delay-200 ${isRTL ? "text-left" : "text-right"}`}
            >
              <Link
                href="/auth/forgetPassword"
                className="text-[0.82rem] font-medium transition-colors duration-200"
                style={{ color: "var(--primary)" }}
              >
                {t("Form.ForgotPassword")}
              </Link>
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

          {/* Footer link */}
          <div
            className={`text-center text-[0.9rem] ${isRTL ? "text-right" : ""}`}
            style={{ color: "var(--text-secondary)" }}
          >
            {t("Footer.Text")}{" "}
            <Link
              href="/auth/signup"
              className="font-semibold transition-colors duration-200"
              style={{ color: "var(--primary)" }}
            >
              {t("Footer.SignUpLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
