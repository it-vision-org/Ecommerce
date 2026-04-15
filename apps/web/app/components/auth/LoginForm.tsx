"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { EmailIcon } from "@/components/ui/Icons";

type LoginFormProps = {
    onSuccess?: () => void;
    redirectTo?: string;

    /** Namespace that contains: EmailLabel, EmailPlaceholder, PasswordLabel, PasswordPlaceholder, SubmitButton, SubmittingButton, (optional) ForgotPassword */
    translationKey?: string;

    /** Optional override. If not provided, RTL is detected from locale (ar*). */
    isRTL?: boolean;

    showSignupLink?: boolean;
    signupLinkHref?: string;

    showRestaurantNote?: boolean;
    restaurantNoteText?: string;

    /** If you want the forgot password link inside the form */
    showForgotPasswordLink?: boolean;
    forgotPasswordHref?: string;
};

export function LoginForm({
    onSuccess,
    redirectTo = "/",
    translationKey = "LoginPage.Form",

    isRTL,
    showSignupLink = true,
    signupLinkHref = "/auth/signup",

    showRestaurantNote = false,
    restaurantNoteText,

    showForgotPasswordLink = true,
    forgotPasswordHref = "/auth/forgetPassword",
}: LoginFormProps) {
    const t = useTranslations(translationKey);
    const tFooter = useTranslations("LoginPage.Footer");
    const tPage = useTranslations("LoginPage");

    const locale = useLocale();
    const resolvedIsRTL = isRTL ?? locale?.toLowerCase().startsWith("ar");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

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

            if (onSuccess) onSuccess();
            else if (redirectTo) window.location.href = redirectTo;
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full" dir={resolvedIsRTL ? "rtl" : "ltr"}>
            {showRestaurantNote && restaurantNoteText && (
                <div
                    className={`flex items-center gap-3 p-4 bg-[var(--primary-light)] rounded-lg mb-6 ${resolvedIsRTL ? "flex-row-reverse" : ""
                        }`}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--primary)] flex-shrink-0"
                    >
                        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                        <path d="M9 22v-4h6v4" />
                        <path d="M8 6h.01" />
                        <path d="M16 6h.01" />
                        <path d="M12 6h.01" />
                        <path d="M12 10h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 10h.01" />
                        <path d="M16 14h.01" />
                        <path d="M8 10h.01" />
                        <path d="M8 14h.01" />
                    </svg>
                    <p
                        className={`text-sm text-[var(--primary)] ${resolvedIsRTL ? "text-right" : "text-left"
                            }`}
                    >
                        {restaurantNoteText}
                    </p>
                </div>
            )}

            {error && (
                <div
                    className={`flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm ${resolvedIsRTL ? "flex-row-reverse text-right" : ""
                        }`}
                >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    isRTL={resolvedIsRTL}
                    label={t("EmailLabel")}
                    icon={<EmailIcon />}
                    placeholder={t("EmailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    isRTL={resolvedIsRTL}
                    label={t("PasswordLabel")}
                    placeholder={t("PasswordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {showForgotPasswordLink && (
                    <div className={`flex ${resolvedIsRTL ? "justify-start" : "justify-end"}`}>
                        <Link
                            href={forgotPasswordHref}
                            className="text-sm text-[var(--primary)] hover:underline"
                        >
                            {t("ForgotPassword")}
                        </Link>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                    }}
                >
                    {isLoading ? t("SubmittingButton") : t("SubmitButton")}
                </button>
            </form>

            {showSignupLink && (
                <>
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-[var(--border)]" />
                        <span className="text-sm text-[var(--text-muted)]">
                            {tPage("Divider")}
                        </span>
                        <div className="flex-1 h-px bg-[var(--border)]" />
                    </div>

                    <div
                        className={`text-sm text-[var(--text-secondary)] ${resolvedIsRTL ? "text-right" : "text-center"
                            }`}
                    >
                        {tFooter("Text")}{" "}
                        <Link
                            href={signupLinkHref}
                            className="text-[var(--primary)] font-medium hover:underline"
                        >
                            {tFooter("SignUpLink")}
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}