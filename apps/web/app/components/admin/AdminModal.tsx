"use client";

import { ReactNode } from "react";
import { X, Check, Loader2 } from "lucide-react";

interface AdminModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel: string;
  canSave: boolean;
  isPending: boolean;
  children: ReactNode;
}

export default function AdminModal({
  open,
  title,
  subtitle,
  onClose,
  onSave,
  saveLabel,
  canSave,
  isPending,
  children,
}: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#e2e8f0] flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">{title}</h2>
            <p className="text-sm text-[#475569] mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f1f5f9] text-[#64748b] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="px-7 py-6 space-y-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-[#e2e8f0] bg-[#f8fafc] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#e2e8f0] bg-white text-sm font-semibold text-[#475569] hover:bg-[#f1f5f9] transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isPending || !canSave}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-sm font-semibold text-white shadow-lg shadow-[#2563eb]/25 hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100 transition"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
