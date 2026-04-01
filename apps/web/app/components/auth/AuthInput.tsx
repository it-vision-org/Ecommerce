"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isRTL?: boolean;
  hasIcon?: boolean;
  hasToggle?: boolean;
  icon?: React.ReactNode;
  label?: string;
  hint?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      isRTL = false,
      hasIcon = true,
      hasToggle = false,
      icon,
      label,
      hint,
      className = "",
      type,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputStyle: React.CSSProperties = {
      border: isFocused
        ? "1.5px solid var(--primary)"
        : "1.5px solid var(--border)",
      color: "var(--text-primary)",
      background: "var(--bg-card)",
      paddingLeft: hasIcon
        ? isRTL
          ? hasToggle
            ? "2.75rem"
            : "1rem"
          : "2.75rem"
        : "1rem",
      paddingRight: hasIcon
        ? isRTL
          ? "2.75rem"
          : hasToggle
            ? "2.75rem"
            : "1rem"
        : "1rem",
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
          {icon && (
            <span
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                color: "var(--text-muted)",
                [isRTL ? "right" : "left"]: "0.875rem",
              }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
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

AuthInput.displayName = "AuthInput";
