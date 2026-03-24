"use client";

import { Eye, EyeOff } from "lucide-react";

interface VisibilityToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

export default function VisibilityToggle({
  value,
  onChange,
}: VisibilityToggleProps) {
  return (
    <div className="flex gap-3">
      {[
        { label: "Published", isPublished: true, Icon: Eye },
        { label: "Hidden", isPublished: false, Icon: EyeOff },
      ].map(({ label, isPublished, Icon }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(isPublished)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${
            value === isPublished
              ? "bg-[#2563eb] text-white border-[#2563eb]"
              : "bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
