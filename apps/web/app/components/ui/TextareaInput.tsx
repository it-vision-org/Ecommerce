import { TextareaHTMLAttributes } from "react";

type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextareaInput({
  className = "",
  ...props
}: TextareaInputProps) {
  return (
    <textarea
      className={`w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition resize-none ${className}`}
      {...props}
    />
  );
}
