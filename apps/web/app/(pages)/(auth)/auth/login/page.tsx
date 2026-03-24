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

  // Check if current locale is RTL (Arabic)
  const isRTL = locale === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success(t("Toast.Success"));

      // Redirect to admin dashboard on success
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
    <>
      <div
        className="min-h-screen flex relative overflow-hidden"
        style={{ fontFamily: "Inter, sans-serif" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* ═══════════════════════════════════════════════════════════
            LEFT PANEL (Desktop Only) 
        ═══════════════════════════════════════════════════════════ */}
        <div
          className="hidden lg:flex lg:w-[42%] relative overflow-hidden items-center justify-center flex-col"
          style={{
            background:
              "linear-gradient(160deg, var(--color-primary-600) 0%, var(--color-primary-500) 40%, var(--color-accent-400) 100%)",
          }}
        >
          {/* Floating Orb 1 */}
          <div
            className={`absolute -top-[20%] w-[500px] h-[500px] rounded-full animate-drift ${isRTL ? "-left-[20%]" : "-right-[20%]"}`}
            style={{
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)",
            }}
          />

          {/* Floating Orb 2 */}
          <div
            className={`absolute -bottom-[15%] w-[400px] h-[400px] rounded-full animate-drift-reverse ${isRTL ? "-right-[10%]" : "-left-[10%]"}`}
            style={{
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
            }}
          />

          {/* Panel Content */}
          <div
            className={`relative z-10 text-center px-12 text-white ${isRTL ? "text-right" : ""}`}
          >
            {/* Spark Icon */}
            <div
              className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center animate-glow"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <svg
                className="w-10 h-10 fill-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7,2V13H10V22L17,10H13L17,2H7Z" />
              </svg>
            </div>

            {/* Title */}
            <h1
              className="text-5xl font-bold leading-tight mb-4"
              style={{
                fontFamily: "Playfair Display, serif",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("LeftPanel.Title")}
            </h1>

            {/* Subtitle */}
            <p className="text-lg opacity-90 leading-relaxed max-w-xs mx-auto">
              {t("LeftPanel.Subtitle")}
            </p>

            {/* Features List */}
            <div
              className={`mt-10 max-w-[280px] mx-auto space-y-3 ${isRTL ? "text-right" : "text-left"}`}
            >
              {["Feature1", "Feature2", "Feature3", "Feature4"].map(
                (feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 opacity-90 ${isRTL ? "justify-start" : ""}`}
                  >
                    {isRTL ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                        <span className="text-[0.95rem]">
                          {t(`LeftPanel.Features.${feature}`)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                        <span className="text-[0.95rem]">
                          {t(`LeftPanel.Features.${feature}`)}
                        </span>
                      </>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            RIGHT FORM AREA 
        ═══════════════════════════════════════════════════════════ */}
        <div
          className="flex-1 flex items-center justify-center relative overflow-y-auto px-8 py-8"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-accent-50) 50%, var(--color-primary-50) 100%)",
          }}
        >
          {/* Background Orb */}
          <div
            className="absolute -top-[30%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
            }}
          />

          {/* Back Button (Mobile Only) */}
          <div
            className={`absolute top-6 z-20 lg:hidden ${isRTL ? "right-6" : "left-6"}`}
          >
            <BackButton color="var(--color-primary-600)" path="/" />
          </div>

          {/* Form Card */}
          <div className="w-full max-w-[480px] relative z-10 animate-card-in py-4">
            {/* Mobile Logo (Mobile Only) */}
            <div
              className={`flex items-center gap-3 mb-6 lg:hidden ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary-500), var(--color-accent-400))",
                }}
              >
                <svg
                  className="w-6 h-6 fill-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7,2V13H10V22L17,10H13L17,2H7Z" />
                </svg>
              </div>
              <span
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{
                  fontFamily: "Playfair Display, serif",
                  background:
                    "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("Brand")}
              </span>
            </div>

            {/* Heading */}
            <h2
              className={`text-3xl font-bold mb-2 ${isRTL ? "text-right" : ""}`}
              style={{
                fontFamily: "Playfair Display, serif",
                color: "var(--color-neutral-900)",
              }}
            >
              {t("Heading")}
            </h2>
            <p
              className={`text-[0.95rem] mb-7 ${isRTL ? "text-right" : ""}`}
              style={{ color: "var(--color-neutral-600)" }}
            >
              {t("Subheading")}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-[1.1rem]">
              {/* Email */}
              <div className="animate-field-in delay-100">
                <label
                  htmlFor="email-address"
                  className={`block text-[0.85rem] font-semibold mb-[0.4rem] ${isRTL ? "text-right" : ""}`}
                  style={{ color: "var(--color-neutral-700)" }}
                >
                  {t("Form.EmailLabel")}
                </label>
                <div className="relative">
                  <svg
                    className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? "right-4" : "left-4"}`}
                    style={{ color: "var(--color-neutral-400)" }}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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
                    className={`w-full py-[0.85rem] rounded-xl text-[0.95rem] bg-white transition-all duration-300 outline-none ${isRTL ? "pr-11 pl-4 text-right" : "pl-11 pr-4"}`}
                    style={{
                      border: "2px solid var(--color-primary-100)",
                      color: "var(--color-neutral-900)",
                    }}
                    placeholder={t("Form.EmailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--color-primary-400)";
                      e.target.style.boxShadow =
                        "0 0 0 4px rgba(59, 130, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--color-primary-100)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="animate-field-in delay-150">
                <label
                  htmlFor="password"
                  className={`block text-[0.85rem] font-semibold mb-[0.4rem] ${isRTL ? "text-right" : ""}`}
                  style={{ color: "var(--color-neutral-700)" }}
                >
                  {t("Form.PasswordLabel")}
                </label>
                <div className="relative">
                  <svg
                    className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? "right-4" : "left-4"}`}
                    style={{ color: "var(--color-neutral-400)" }}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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
                    className={`w-full py-[0.85rem] rounded-xl text-[0.95rem] bg-white transition-all duration-300 outline-none ${isRTL ? "pr-11 pl-11 text-right" : "pl-11 pr-11"}`}
                    style={{
                      border: "2px solid var(--color-primary-100)",
                      color: "var(--color-neutral-900)",
                    }}
                    placeholder={t("Form.PasswordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--color-primary-400)";
                      e.target.style.boxShadow =
                        "0 0 0 4px rgba(59, 130, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--color-primary-100)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    className={`absolute top-1/2 -translate-y-1/2 p-0 bg-transparent border-none cursor-pointer transition-colors duration-200 ${isRTL ? "left-4" : "right-4"}`}
                    style={{ color: "var(--color-neutral-400)" }}
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-neutral-600)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-neutral-400)")
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
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

              {/* Forgot Password Link */}
              <div
                className={`animate-field-in delay-200 ${isRTL ? "text-left" : "text-right"}`}
              >
                <Link
                  href="/auth/forgetPassword"
                  className="text-sm font-semibold inline-block transition-colors duration-200"
                  style={{ color: "var(--color-primary-600)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-primary-700)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-primary-600)")
                  }
                >
                  {t("Form.ForgotPassword")}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-[0.95rem] rounded-xl font-semibold text-white transition-all duration-300 mt-2 disabled:opacity-55 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 100%)",
                  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.25)",
                }}
                onMouseEnter={(e) =>
                  !isLoading &&
                  ((e.currentTarget.style.transform = "translateY(-2px)"),
                  (e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(59, 130, 246, 0.35)"))
                }
                onMouseLeave={(e) =>
                  !isLoading &&
                  ((e.currentTarget.style.transform = "translateY(0)"),
                  (e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(59, 130, 246, 0.25)"))
                }
                onMouseDown={(e) =>
                  !isLoading &&
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      width="20"
                      height="20"
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
                style={{ background: "var(--color-primary-200)" }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--color-neutral-400)" }}
              >
                {t("Divider")}
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "var(--color-primary-200)" }}
              />
            </div>

            {/* Footer Link */}
            <div
              className={`text-center text-[0.9rem] ${isRTL ? "text-right" : ""}`}
              style={{ color: "var(--color-neutral-600)" }}
            >
              {t("Footer.Text")}{" "}
              <Link
                href="/auth/signup"
                className="font-semibold relative inline-block transition-colors duration-200 group"
                style={{ color: "var(--color-primary-600)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary-700)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary-600)")
                }
              >
                {t("Footer.SignUpLink")}
                <span
                  className={`absolute bottom-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${isRTL ? "right-0" : "left-0"}`}
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-primary-500), var(--color-accent-400))",
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
