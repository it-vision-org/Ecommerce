"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Crown,
  Users,
  Loader2,
  GripVertical,
  UserCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getAllMembersForAdmin,
  createMember,
  updateMember,
  deleteMember,
} from "@/actions/AboutActions";
import { ClubMemberData } from "@/types";
import { getCurrentSchoolYear } from "@/lib/utils";

import Uploader from "@/components/admin/Uploader";

// ─── Types ─────────────────────────────────────────────────────────────────────

type MemberForm = {
  name: string;
  role: string;
  image: string | null;
  isFounder: boolean;
  schoolYear: string;
};

const emptyForm = (schoolYear: string): MemberForm => ({
  name: "",
  role: "",
  image: null,
  isFounder: false,
  schoolYear,
});

// ─── Sub-components ────────────────────────────────────────────────────────────

function MemberAvatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
  };

  if (image) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl overflow-hidden flex-shrink-0 relative`}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {initials || <UserCircle2 className="w-4 h-4" />}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
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

// ─── Member Modal ──────────────────────────────────────────────────────────────

function MemberModal({
  open,
  onClose,
  onSave,
  initial,
  schoolYear,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: MemberForm) => void;
  initial: MemberForm | null;
  schoolYear: string;
  isPending: boolean;
}) {
  const [form, setForm] = useState<MemberForm>(
    initial ?? emptyForm(schoolYear),
  );

  useEffect(() => {
    setForm(initial ?? emptyForm(schoolYear));
  }, [initial, schoolYear, open]);

  if (!open) return null;

  const handleField = (field: keyof MemberForm, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    "w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#e2e8f0]">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">
              {initial ? "Edit Member" : "Add New Member"}
            </h2>
            <p className="text-sm text-[#475569] mt-0.5">
              {form.isFounder
                ? "Founding member"
                : `School year ${form.schoolYear}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f1f5f9] text-[#64748b] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-5">
          {/* Avatar preview + uploader */}
          <div className="flex items-center gap-4">
            <MemberAvatar
              name={form.name || "?"}
              image={form.image}
              size="lg"
            />
            <div>
              <p className="text-sm font-semibold text-[#0f172a] mb-2">Photo</p>
              <Uploader
                buttonText="Upload Photo"
                maxFileCount={1}
                value={form.image}
                handleUploadComplete={(res) => {
                  if (res[0]?.ufsUrl) handleField("image", res[0].ufsUrl);
                }}
              />
              {form.image && (
                <button
                  onClick={() => handleField("image", null)}
                  className="mt-2 cursor-pointer text-xs text-red-500 hover:text-red-700 transition"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">
              Full Name
            </label>
            <input
              className={inputClass}
              placeholder="e.g. Ahmed Ben Ali"
              value={form.name}
              onChange={(e) => handleField("name", e.target.value)}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">
              Role
            </label>
            <input
              className={inputClass}
              placeholder="e.g. President, Secretary..."
              value={form.role}
              onChange={(e) => handleField("role", e.target.value)}
            />
          </div>

          {/* Type toggle */}
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">
              Member Type
            </label>
            <div className="flex gap-3">
              {[
                { label: "Current Member", value: false },
                { label: "Founding Member", value: true },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => handleField("isFounder", value)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${
                    form.isFounder === value
                      ? "bg-[#2563eb] text-white border-[#2563eb]"
                      : "bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* School year (only for non-founders) */}
          {!form.isFounder && (
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">
                School Year
              </label>
              <input
                className={inputClass}
                placeholder="e.g. 2025/2026"
                value={form.schoolYear}
                onChange={(e) => handleField("schoolYear", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#e2e8f0] bg-white text-sm font-semibold text-[#475569] hover:bg-[#f1f5f9] transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isPending || !form.name.trim() || !form.role.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-sm font-semibold text-white shadow-lg shadow-[#2563eb]/25 hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100 transition"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {initial ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Member Row ────────────────────────────────────────────────────────────────

function MemberRow({
  member,
  onEdit,
  onDelete,
  isDeleting,
}: {
  member: ClubMemberData;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:shadow-sm transition group">
      <GripVertical className="w-4 h-4 text-[#cbd5e1] flex-shrink-0 cursor-grab" />
      <MemberAvatar name={member.name} image={member.image} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#0f172a] truncate">{member.name}</p>
        <span className="inline-block mt-0.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#0369a1]">
          {member.role}
        </span>
      </div>
      {member.isFounder && (
        <Crown
          className="w-4 h-4 text-[#f59e0b] flex-shrink-0"
          name="Founding member"
        />
      )}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
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

// ─── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminAboutPage() {
  const schoolYear = getCurrentSchoolYear();

  const [members, setMembers] = useState<ClubMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClubMemberData | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Fetch ──
  const fetchMembers = async () => {
    setLoading(true);
    const result = await getAllMembersForAdmin();
    if (result.success && result.data) setMembers(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ── Derived ──
  const founders = members.filter((m) => m.isFounder);
  const currentYear = members.filter(
    (m) => !m.isFounder && m.schoolYear === schoolYear,
  );
  const otherYears = members.filter(
    (m) => !m.isFounder && m.schoolYear !== schoolYear,
  );

  // ── Handlers ──
  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (member: ClubMemberData) => {
    setEditTarget(member);
    setModalOpen(true);
  };

  const handleSave = (form: MemberForm) => {
    startTransition(async () => {
      if (editTarget) {
        const result = await updateMember({
          id: editTarget.id,
          name: form.name,
          role: form.role,
          image: form.image,
        });
        if (result.success) {
          toast.success("Member updated!");
          setModalOpen(false);
          fetchMembers();
        } else {
          toast.error(result.error ?? "Failed to update member");
        }
      } else {
        const result = await createMember({
          name: form.name,
          role: form.role,
          image: form.image ?? undefined,
          isFounder: form.isFounder,
          schoolYear: form.isFounder ? undefined : form.schoolYear,
        });
        if (result.success) {
          toast.success("Member added!");
          setModalOpen(false);
          fetchMembers();
        } else {
          toast.error(result.error ?? "Failed to add member");
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteMember(id);
      if (result.success) {
        toast.success("Member removed");
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast.error(result.error ?? "Failed to delete member");
      }
      setDeletingId(null);
    });
  };

  const modalInitial: MemberForm | null = editTarget
    ? {
        name: editTarget.name,
        role: editTarget.role,
        image: editTarget.image,
        isFounder: editTarget.isFounder,
        schoolYear: editTarget.schoolYear ?? schoolYear,
      }
    : null;

  // ── Render ──
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Club Members</h1>
            <p className="text-sm text-[#475569] mt-0.5">
              Manage founders and current year members
            </p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-sm font-semibold text-white shadow-lg shadow-[#2563eb]/25 hover:scale-[1.02] transition"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Members"
            value={members.length}
            icon={Users}
            color="bg-[#e0f2fe] text-[#0369a1]"
          />
          <StatCard
            label="Founders"
            value={founders.length}
            icon={Crown}
            color="bg-[#fef9c3] text-[#854d0e]"
          />
          <StatCard
            label={`${schoolYear}`}
            value={currentYear.length}
            icon={Users}
            color="bg-[#dcfce7] text-[#166534]"
          />
          <StatCard
            label="Past Years"
            value={otherYears.length}
            icon={Users}
            color="bg-[#f3e8ff] text-[#6b21a8]"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#2563eb]" />
          </div>
        )}

        {!loading && (
          <>
            {/* Founders */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-5 h-5 text-[#f59e0b]" />
                <h2 className="text-lg font-bold text-[#0f172a]">
                  Founding Members
                </h2>
                <span className="ml-auto px-3 py-1 text-xs font-semibold rounded-full bg-[#fef9c3] text-[#854d0e]">
                  {founders.length}
                </span>
              </div>
              {founders.length === 0 ? (
                <EmptyState label="No founders added yet" />
              ) : (
                <div className="space-y-3">
                  {founders.map((m) => (
                    <MemberRow
                      key={m.id}
                      member={m}
                      onEdit={() => openEdit(m)}
                      onDelete={() => handleDelete(m.id)}
                      isDeleting={deletingId === m.id}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Current year */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-[#2563eb]" />
                <h2 className="text-lg font-bold text-[#0f172a]">
                  {schoolYear} Members
                </h2>
                <span className="ml-auto px-3 py-1 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#0369a1]">
                  {currentYear.length}
                </span>
              </div>
              {currentYear.length === 0 ? (
                <EmptyState label={`No members for ${schoolYear} yet`} />
              ) : (
                <div className="space-y-3">
                  {currentYear.map((m) => (
                    <MemberRow
                      key={m.id}
                      member={m}
                      onEdit={() => openEdit(m)}
                      onDelete={() => handleDelete(m.id)}
                      isDeleting={deletingId === m.id}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Past years */}
            {otherYears.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-[#a78bfa]" />
                  <h2 className="text-lg font-bold text-[#0f172a]">
                    Past Years
                  </h2>
                  <span className="ml-auto px-3 py-1 text-xs font-semibold rounded-full bg-[#f3e8ff] text-[#6b21a8]">
                    {otherYears.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {otherYears.map((m) => (
                    <MemberRow
                      key={m.id}
                      member={m}
                      onEdit={() => openEdit(m)}
                      onDelete={() => handleDelete(m.id)}
                      isDeleting={deletingId === m.id}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <MemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={modalInitial}
        schoolYear={schoolYear}
        isPending={isPending}
      />
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-10 rounded-2xl border border-dashed border-[#cbd5e1] text-center text-sm text-[#94a3b8]">
      {label}
    </div>
  );
}
