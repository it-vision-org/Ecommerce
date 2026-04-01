"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import BackButton from "@/components/ui/BackButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PhoneNumberInput } from "@/components/auth/PhoneNumberInput";
import {
  EmailIcon,
  UserIcon,
  ShoppingBagIcon,
  SpinnerIcon,
  MapPinIcon,
} from "@/components/ui/Icons";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "+216",
    address: "",
    userType: "INDIVIDUAL",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("SignupPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { countryCode, ...rest } = formData;
      const payload = {
        ...rest,
        phoneNumber: formData.phoneNumber
          ? `${countryCode} ${formData.phoneNumber}`.trim()
          : "",
      };
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success(t("Toast.Success"));
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (error: any) {
      toast.error(error.message || t("Toast.Error"));
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    {
      value: "INDIVIDUAL",
      label: t("Form.UserTypes.Individual.Label"),
      icon: t("Form.UserTypes.Individual.Icon"),
      desc: t("Form.UserTypes.Individual.Description"),
    },
    {
      value: "RESTAURANT",
      label: t("Form.UserTypes.Restaurant.Label"),
      icon: t("Form.UserTypes.Restaurant.Icon"),
      desc: t("Form.UserTypes.Restaurant.Description"),
    },
  ];
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
        tagline={t("LeftPanel.Tagline")}
        icon={<ShoppingBagIcon size={38} />}
      />

      {/* Right Form Area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-y-auto px-8 py-10"
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
          className={`absolute top-5 z-20 lg:hidden ${isRTL ? "right-5" : "left-5"}`}
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
            className={`text-[0.9rem] mb-7 font-normal ${isRTL ? "text-right" : ""}`}
            style={{ color: "var(--text-secondary)" }}
          >
            {t("Subheading")}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="animate-field-in delay-100">
              <AuthInput
                id="name"
                name="name"
                type="text"
                required
                isRTL={isRTL}
                label={t("Form.NameLabel")}
                icon={<UserIcon />}
                placeholder={t("Form.NamePlaceholder")}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="animate-field-in delay-150">
              <AuthInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                isRTL={isRTL}
                label={t("Form.EmailLabel")}
                icon={<EmailIcon />}
                placeholder={t("Form.EmailPlaceholder")}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="animate-field-in delay-200">
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                required
                isRTL={isRTL}
                label={t("Form.PasswordLabel")}
                placeholder={t("Form.PasswordPlaceholder")}
                hint={t("Form.PasswordHint")}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Phone Number */}
            <div className="animate-field-in delay-250">
              <PhoneNumberInput formData={formData} setFormData={setFormData} />
            </div>

            {/* Address */}
            <div className="animate-field-in delay-300">
              <AuthInput
                id="address"
                name="address"
                type="text"
                isRTL={isRTL}
                label={t("Form.AddressLabel")}
                icon={<MapPinIcon />}
                placeholder={t("Form.AddressPlaceholder")}
                hint={t("Form.AddressHint")}
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* User Type */}
            <div className="animate-field-in delay-300">
              <label
                className={`block text-[0.85rem] font-semibold mb-[0.4rem] ${isRTL ? "text-right" : ""}`}
                style={{ color: "var(--color-neutral-700)" }}
              >
                {t("Form.UserTypeLabel")}
              </label>
              <div className="grid grid-cols-2 gap-5">
                {userTypeOptions.map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value={opt.value}
                      checked={formData.userType === opt.value}
                      onChange={handleChange}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <div
                      className={`flex flex-col items-center py-4 px-2 rounded-2xl bg-white transition-all duration-300 text-center ${
                        formData.userType === opt.value
                          ? "shadow-lg -translate-y-0.5"
                          : "hover:-translate-y-0.5"
                      }`}
                      style={{
                        border:
                          formData.userType === opt.value
                            ? "2px solid var(--color-primary-500)"
                            : "2px solid var(--color-primary-100)",
                        background:
                          formData.userType === opt.value
                            ? "linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))"
                            : "white",
                        boxShadow:
                          formData.userType === opt.value
                            ? "0 4px 16px rgba(59, 130, 246, 0.15)"
                            : "none",
                      }}
                    >
                      <span className="text-[1.75rem] mb-[0.4rem]">
                        {opt.icon}
                      </span>
                      <span
                        className="text-[0.85rem] font-semibold"
                        style={{ color: "var(--color-neutral-700)" }}
                      >
                        {opt.label}
                      </span>
                      <span
                        className="text-[0.65rem] mt-[0.2rem] leading-tight"
                        style={{ color: "var(--color-neutral-500)" }}
                      >
                        {opt.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <div className="animate-field-in delay-350 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-[0.92rem] transition-all duration-200 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
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
              href="/auth/login"
              className="font-semibold transition-colors duration-200"
              style={{ color: "var(--primary)" }}
            >
              {t("Footer.SignInLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
