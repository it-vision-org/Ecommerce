"use client";

import { Plus } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
}

export default function AdminPageHeader({
  title,
  description,
  addLabel,
  onAdd,
}: AdminPageHeaderProps) {
  return (
    <div className="bg-white border-b border-[#e2e8f0]">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">{title}</h1>
          <p className="text-sm text-[#475569] mt-0.5">{description}</p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-sm font-semibold text-white shadow-lg shadow-[#2563eb]/25 hover:scale-[1.02] transition"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      </div>
    </div>
  );
}
