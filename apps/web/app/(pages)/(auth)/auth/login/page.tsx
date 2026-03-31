"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import BackButton from "@/components/ui/BackButton";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("LoginPage");
  const locale = useLocale();

  const isRTL = locale === "ar";

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid var(--border)",
    color: "var(--text-primary)",
    background: "var(--bg-card)",
    paddingLeft: isRTL ? "1rem" : "2.75rem",
    paddingRight: isRTL ? "2.75rem" : "1rem",
    textAlign: isRTL ? "right" : "left",
  };

  const inputStylePassword: React.CSSProperties = {
    border: "1.5px solid var(--border)",
    color: "var(--text-primary)",
    background: "var(--bg-card)",
    paddingLeft: "2.75rem",
    paddingRight: "2.75rem",
    textAlign: isRTL ? "right" : "left",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || t("Toast.Error"));
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ═══════════════════════════════════════════════════════════
          LEFT PANEL (Desktop Only) — Ocean Blue Gradient
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden items-center justify-center flex-col"
        style={{
          background:
            "linear-gradient(160deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)",
        }}
      >
        {/* Soft wave shapes */}
        <div
          className={`absolute top-[5%] w-[400px] h-[400px] rounded-full pointer-events-none animate-drift ${isRTL ? "left-[-15%]" : "right-[-15%]"}`}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className={`absolute bottom-[5%] w-[350px] h-[350px] rounded-full pointer-events-none animate-drift-reverse ${isRTL ? "right-[-10%]" : "left-[-10%]"}`}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Floating dots */}
        {[
          { size: 6, x: "18%", y: "25%", delay: "0s" },
          { size: 4, x: "72%", y: "18%", delay: "1.5s" },
          { size: 8, x: "55%", y: "65%", delay: "0.8s" },
          { size: 5, x: "30%", y: "78%", delay: "2.5s" },
          { size: 3, x: "80%", y: "50%", delay: "1.2s" },
        ].map((d, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none animate-float"
            style={{
              width: d.size,
              height: d.size,
              left: d.x,
              top: d.y,
              animationDelay: d.delay,
              background: "rgba(255,255,255,0.35)",
            }}
          />
        ))}

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />

        {/* Panel Content */}
        <div
          className={`relative z-10 px-12 text-center ${isRTL ? "text-right" : ""}`}
        >
          {/* Icon */}
          <div
            className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center animate-glow"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
            }}
          >
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
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="text-[2.6rem] leading-tight mb-4 font-bold"
            style={{
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {t("LeftPanel.Title")}
          </h1>

          {/* Divider */}
          <div
            className="w-14 h-[2px] mx-auto mb-5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />

          {/* Subtitle */}
          <p
            className="text-[0.95rem] leading-relaxed max-w-[300px] mx-auto"
            style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}
          >
            {t("LeftPanel.Subtitle")}
          </p>

          {/* Features */}
          <div
            className={`mt-10 max-w-[280px] mx-auto space-y-3 ${isRTL ? "text-right" : "text-left"}`}
          >
            {["Feature1", "Feature2", "Feature3", "Feature4"].map(
              (feature, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.6)" }}
                  />
                  <span
                    className="text-[0.9rem] font-light"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {t(`LeftPanel.Features.${feature}`)}
                  </span>
                </div>
              ),
            )}
          </div>

          {/* Bottom tagline */}
          <p
            className="mt-12 text-[0.75rem] uppercase tracking-[0.18em] font-medium"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {t("Brand")}
          </p>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: 60 }}
          >
            <path
              d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
              fill="rgba(255,255,255,0.05)"
            />
          </svg>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT FORM AREA
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-y-auto px-8 py-8"
        style={{ background: "var(--bg)" }}
      >
        {/* Subtle radial highlights */}
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

        {/* Top accent line (mobile) */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] lg:hidden"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--primary), transparent)",
          }}
        />

        {/* Back Button (Mobile Only) */}
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
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

          {/* Accent line */}
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
              <label
                htmlFor="email-address"
                className={`block text-[0.82rem] font-semibold mb-[0.4rem] `}
                style={{
                  color: "var(--text-primary)",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("Form.EmailLabel")}
              </label>
              <div className="relative">
                <svg
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none "
                  style={{
                    color: "var(--text-muted)",
                    [isRTL ? "right" : "left"]: "0.875rem",
                  }}
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full py-3 rounded-xl text-[0.92rem] transition-all duration-200 outline-none "
                  style={inputStyle}
                  placeholder={t("Form.EmailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="animate-field-in delay-150">
              <label
                htmlFor="password"
                className="block text-[0.82rem] font-semibold mb-[0.4rem] "
                style={{
                  color: "var(--text-primary)",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("Form.PasswordLabel")}
              </label>
              <div className="relative">
                <svg
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none "
                  style={{
                    color: "var(--text-muted)",
                    [isRTL ? "right" : "left"]: "0.875rem",
                  }}
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full py-3 rounded-xl text-[0.92rem] transition-all duration-200 outline-none"
                  style={inputStylePassword}
                  placeholder={t("Form.PasswordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 p-0 bg-transparent border-none cursor-pointer transition-colors duration-200"
                  style={{
                    color: "var(--text-muted)",
                    [isRTL ? "left" : "right"]: "0.875rem",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div
              className={`animate-field-in delay-200 ${isRTL ? "text-left" : "text-right"}`}
            >
              <Link
                href="/auth/forgetPassword"
                className="text-[0.82rem] font-medium transition-colors duration-200"
                style={{ color: "var(--primary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--primary-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--primary)")
                }
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
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(14,165,233,0.35)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(14,165,233,0.25)";
                }
              }}
              onMouseDown={(e) => {
                if (!isLoading)
                  e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="animate-spin"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="31.4 31.4"
                      strokeLinecap="round"
                    />
                  </svg>
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--primary)")
              }
            >
              {t("Footer.SignUpLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
