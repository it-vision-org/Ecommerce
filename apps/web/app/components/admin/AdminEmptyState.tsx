interface AdminEmptyStateProps {
  label: string;
}

export default function AdminEmptyState({ label }: AdminEmptyStateProps) {
  return (
    <div className="py-14 rounded-2xl border border-dashed border-[#cbd5e1] text-center text-sm text-[#94a3b8]">
      {label}
    </div>
  );
}