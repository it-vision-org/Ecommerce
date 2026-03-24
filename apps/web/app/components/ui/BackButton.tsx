"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  color?: string;
  path?: string;
}

export default function BackButton({ color, path }: BackButtonProps) {
  const router = useRouter();

  const textColor = color || "#3A5FCD";

  const handleBack = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 pr-2 py-2 hover:text-gray-900 cursor-pointer rounded-md transition-colors"
      style={{ color: textColor }}
    >
      <ArrowLeft size={25} />
    </button>
  );
}
