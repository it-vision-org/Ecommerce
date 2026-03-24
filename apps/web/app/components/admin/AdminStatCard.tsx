import { ElementType } from "react";

interface AdminStatCardProps {
  label: string;
  value: number;
  icon: ElementType;
  color: string;
}

export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  color,
}: AdminStatCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-[#e2e8f0] bg-white flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
        <p className="text-sm text-[#475569]">{label}</p>
      </div>
    </div>
  );
}
