import { SelectHTMLAttributes, ReactNode } from "react";

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export default function SelectInput({
  className = "",
  children,
  ...props
}: SelectInputProps) {
  return (
    <select
      className={`w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#0f172a] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
