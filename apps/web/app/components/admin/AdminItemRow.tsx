"use client";

import { ReactNode } from "react";
import Image from "next/image";
import {
  GripVertical,
  ImageOff,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

interface AdminItemRowProps {
  thumbnail: string | null;
  title: string;
  meta: ReactNode;
  isPublished: boolean;
  isDeleting: boolean;
  isToggling: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  publishedLabel?: string;
  hiddenLabel?: string;
}

export default function AdminItemRow({
  thumbnail,
  title,
  meta,
  isPublished,
  isDeleting,
  isToggling,
  onEdit,
  onDelete,
  onTogglePublish,
  publishedLabel = "Published",
  hiddenLabel = "Hidden",
}: AdminItemRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:shadow-sm transition group">
      <GripVertical className="w-4 h-4 text-[#cbd5e1] flex-shrink-0 cursor-grab" />

      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative bg-[#f1f5f9]">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-5 h-5 text-[#94a3b8]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#0f172a] truncate">{title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">{meta}</div>
      </div>

      {/* Publish badge */}
      <span
        className={`hidden sm:inline-flex px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
          isPublished
            ? "bg-[#dcfce7] text-[#166534]"
            : "bg-[#f1f5f9] text-[#64748b]"
        }`}
      >
        {isPublished ? publishedLabel : hiddenLabel}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={onTogglePublish}
          disabled={isToggling}
          title={isPublished ? hiddenLabel : publishedLabel}
          className="p-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e0f2fe] hover:border-[#bae6fd] text-[#475569] hover:text-[#0369a1] transition disabled:opacity-50"
        >
          {isToggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPublished ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onEdit}
          className="p-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e0f2fe] hover:border-[#bae6fd] text-[#475569] hover:text-[#0369a1] transition"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-red-50 hover:border-red-200 text-[#475569] hover:text-red-600 transition disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
