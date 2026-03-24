import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({
  label,
  required,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0f172a] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
