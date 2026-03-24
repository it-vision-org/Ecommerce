interface SectionBadgeProps {
  label: string;
}

export default function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0f2fe] text-[#0369a1] text-sm font-semibold">
      {label}
    </span>
  );
}
