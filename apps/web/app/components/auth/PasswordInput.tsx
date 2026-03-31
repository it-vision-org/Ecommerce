"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  isRTL?: boolean;
  label?: string;
  hint?: string;
}

const LockIcon = () => (
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
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
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
);

const EyeOffIcon = () => (
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
);

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ isRTL = false, label, hint, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputStyle: React.CSSProperties = {
      border: isFocused
        ? "1.5px solid var(--primary)"
        : "1.5px solid var(--border)",
      color: "var(--text-primary)",
      background: "var(--bg-card)",
      paddingLeft: "2.75rem",
      paddingRight: "2.75rem",
      textAlign: isRTL ? "right" : "left",
      boxShadow: isFocused ? "0 0 0 3px rgba(14,165,233,0.1)" : "none",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-[0.82rem] font-semibold mb-[0.4rem]"
            style={{
              color: "var(--text-primary)",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {/* Lock Icon */}
          <span
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              color: "var(--text-muted)",
              [isRTL ? "right" : "left"]: "0.875rem",
            }}
          >
            <LockIcon />
          </span>

          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`w-full py-3 rounded-xl text-[0.92rem] transition-all duration-200 outline-none ${className}`}
            style={inputStyle}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Toggle Button */}
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
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {hint && (
          <p
            className="text-[0.78rem] mt-1.5"
            style={{
              color: "var(--text-muted)",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
