import { ReactNode } from "react";

type LabelProps = {
  label: string;
  htmlFor: string;
  isRTL?: boolean;
  children: ReactNode;
};

export default function Label({ label, htmlFor, isRTL = false, children }: LabelProps) {
  return (
    <div className={isRTL ? "text-right" : ""}>
      <label className="block text-sm font-semibold text-[#0f172a] mb-2" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}