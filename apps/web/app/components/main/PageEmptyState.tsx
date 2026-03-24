import { ReactNode } from "react";

interface PageEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function PageEmptyState({
  icon,
  title,
  description,
}: PageEmptyStateProps) {
  return (
    <div className="text-center py-24">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e0f2fe] mb-6">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-[#0f172a]">{title}</h2>
      <p className="mt-2 text-[#475569]">{description}</p>
    </div>
  );
}
