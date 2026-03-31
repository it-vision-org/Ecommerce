"use client";

import { Suspense, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import BackButton from "@/components/ui/BackButton";

export default function ResetPasswordForm() {
  const t = useTranslations("ResetPasswordPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const inputPadding = isRTL ? "pr-11 pl-11 text-right" : "pl-11 pr-11";
  const iconPosition = isRTL ? "right-3.5" : "left-3.5";
  const togglePosition = isRTL ? "left-3.5" : "right-3.5";

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid var(--border)",
    color: "var(--text-primary)",
    background: "var(--bg-card)",
    paddingLeft: "2.75rem",
    paddingRight: "2.75rem",
    textAlign: isRTL ? "right" : "left",
  };

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

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden items-center justify-center flex-col"
        style={{
          background:
            "linear-gradient(160deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)",
        }}
      >
        {/* Wave shapes */}
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
          { size: 6, x: "20%", y: "28%", delay: "0s" },
          { size: 4, x: "75%", y: "18%", delay: "1.5s" },
          { size: 8, x: "55%", y: "70%", delay: "1s" },
          { size: 5, x: "30%", y: "82%", delay: "2.5s" },
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

        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />

        <div
          className={`relative z-10 px-12 text-white ${isRTL ? "text-right" : "text-center"}`}
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <h1
            className="text-[2.6rem] font-bold leading-tight mb-4"
            style={{
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {t("LeftPanel.TitleLine1")}
            <br />
            {t("LeftPanel.TitleLine2")}
          </h1>

          <div
            className="w-14 h-[2px] mx-auto mb-5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />

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
            {features.map((feature, idx) => (
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
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

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

      {/* Right form area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-y-auto px-8 py-8"
        style={{ background: "var(--bg)" }}
      >
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

        <div
          className={`absolute top-6 z-20 lg:hidden ${isRTL ? "right-6" : "left-6"}`}
        >
          <BackButton color="var(--primary)" path="/auth/login" />
        </div>

        <div className="w-full max-w-[440px] relative z-10 animate-card-in py-4">
          {/* Mobile logo */}
          <div
            className={`flex items-center gap-3 mb-6 lg:hidden ${isRTL ? "flex-row-reverse" : ""}`}
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {t("LeftPanel.TitleLine1")} {t("LeftPanel.TitleLine2")}
            </span>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="animate-field-in delay-100">
              <label
                htmlFor="password"
                className={`block text-[0.82rem] font-semibold mb-[0.4rem] ${isRTL ? "text-right" : ""}`}
                style={{ color: "var(--text-primary)" }}
              >
                {t("Form.NewPassword")}
              </label>
              <div className="relative">
                <svg
                  className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 pointer-events-none`}
                  style={{ color: "var(--text-muted)" }}
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
                  dir={isRTL ? "rtl" : "ltr"}
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full py-3 rounded-xl text-[0.92rem] transition-all duration-200 outline-none"
                  style={inputStyle}
                  placeholder={t("Form.PlaceholderNew")}
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
                  className={`absolute ${togglePosition} top-1/2 -translate-y-1/2 p-0 bg-transparent border-none cursor-pointer transition-colors duration-200`}
                  style={{ color: "var(--text-muted)" }}
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

            {/* Confirm Password */}
            <div className="animate-field-in delay-150">
              <label
                htmlFor="confirmPassword"
                className={`block text-[0.82rem] font-semibold mb-[0.4rem] ${isRTL ? "text-right" : ""}`}
                style={{ color: "var(--text-primary)" }}
              >
                {t("Form.ConfirmPassword")}
              </label>
              <div className="relative">
                <svg
                  className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 pointer-events-none`}
                  style={{ color: "var(--text-muted)" }}
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  dir={isRTL ? "rtl" : "ltr"}
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full py-3 rounded-xl text-[0.92rem] transition-all duration-200 outline-none"
                  style={inputStyle}
                  placeholder={t("Form.PlaceholderConfirm")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  className={`absolute ${togglePosition} top-1/2 -translate-y-1/2 p-0 bg-transparent border-none cursor-pointer transition-colors duration-200`}
                  style={{ color: "var(--text-muted)" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
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
              onMouseEnter={(e) =>
                !isSubmitting &&
                ((e.currentTarget.style.transform = "translateY(-2px)"),
                (e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(14,165,233,0.35)"))
              }
              onMouseLeave={(e) =>
                !isSubmitting &&
                ((e.currentTarget.style.transform = "translateY(0)"),
                (e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(14,165,233,0.25)"))
              }
              onMouseDown={(e) =>
                !isSubmitting &&
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {isSubmitting ? (
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--primary)")
              }
            >
              <svg
                className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {t("Form.BackToLogin")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
