import { ReactNode } from "react";

interface AdminSectionHeaderProps {
  icon: ReactNode;
  title: string;
  count: number;
  badgeColor: string;
}

export default function AdminSectionHeader({
  icon,
  title,
  count,
  badgeColor,
}: AdminSectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-lg font-bold text-[#0f172a]">{title}</h2>
      <span
        className={`ml-auto px-3 py-1 text-xs font-semibold rounded-full ${badgeColor}`}
      >
        {count}
      </span>
    </div>
  );
}
