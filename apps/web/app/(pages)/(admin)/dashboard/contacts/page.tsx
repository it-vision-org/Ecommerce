"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  getContactSubmissions,
  markContactAsRead,
  markContactAsUnread,
  deleteContactSubmission,
  type ContactSubmission,
} from "@/actions/contactActions";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { toast } from "react-hot-toast";

type FilterType = "all" | "unread" | "read";
type SortType = "newest" | "oldest";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const result = await getContactSubmissions();
    if (result.success && result.contacts) {
      setContacts(result.contacts);
    } else {
      toast.error("Failed to load contacts");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filteredContacts = useMemo(() => {
    let list = [...contacts];

    // Filter
    if (filter === "unread") list = list.filter((c) => !c.isRead);
    if (filter === "read") list = list.filter((c) => c.isRead);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.subject && c.subject.toLowerCase().includes(q)) ||
          c.message.toLowerCase().includes(q),
      );
    }

    // Sort
    list.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [contacts, filter, sort, search]);

  const stats = useMemo(
    () => ({
      total: contacts.length,
      unread: contacts.filter((c) => !c.isRead).length,
      read: contacts.filter((c) => c.isRead).length,
    }),
    [contacts],
  );

  const handleToggleRead = async (contact: ContactSubmission) => {
    const action = contact.isRead ? markContactAsUnread : markContactAsRead;
    const result = await action(contact.id);
    if (result.success) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id ? { ...c, isRead: !c.isRead } : c,
        ),
      );
      if (selectedContact?.id === contact.id) {
        setSelectedContact({ ...contact, isRead: !contact.isRead });
      }
      toast.success(contact.isRead ? "Marked as unread" : "Marked as read");
    } else {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deleteContactSubmission(id);
    if (result.success) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
      toast.success("Contact deleted");
    } else {
      toast.error("Failed to delete");
    }
    setDeletingId(null);
    setShowDeleteConfirm(null);
  };

  const handleSelectContact = async (contact: ContactSubmission) => {
    setSelectedContact(contact);
    if (!contact.isRead) {
      const result = await markContactAsRead(contact.id);
      if (result.success) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? { ...c, isRead: true } : c)),
        );
        setSelectedContact({ ...contact, isRead: true });
      }
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatFullDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubjectColor = (subject: string | null) => {
    if (!subject)
      return {
        bg: "var(--color-neutral-100)",
        text: "var(--color-neutral-600)",
      };
    const s = subject.toLowerCase();
    if (s.includes("technique") || s.includes("technical"))
      return { bg: "#fef2f2", text: "#dc2626" };
    if (s.includes("étudiant") || s.includes("student"))
      return { bg: "#eff6ff", text: "var(--color-primary-600)" };
    if (s.includes("parent")) return { bg: "#f0fdf4", text: "#16a34a" };
    if (
      s.includes("enseignant") ||
      s.includes("teacher") ||
      s.includes("collaboration")
    )
      return { bg: "#fdf4ff", text: "#9333ea" };
    if (s.includes("partenariat") || s.includes("partnership"))
      return { bg: "#fefce8", text: "#ca8a04" };
    if (s.includes("événement") || s.includes("event"))
      return { bg: "#fff7ed", text: "#ea580c" };
    return { bg: "var(--color-primary-50)", text: "var(--color-primary-700)" };
  };

  const getUserTypeBadge = (userType: string | null) => {
    switch (userType) {
      case "STUDENT":
        return {
          label: "🎓 Student",
          bg: "#eff6ff",
          text: "var(--color-primary-600)",
        };
      case "TEACHER":
        return { label: "📚 Teacher", bg: "#f0fdf4", text: "#16a34a" };
      case "PARENT":
        return { label: "🏠 Parent", bg: "#fdf4ff", text: "#9333ea" };
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ─── RENDER ──────────────────────────────────────────────

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-neutral-50)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: "var(--color-primary-200)",
              borderTopColor: "transparent",
            }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-neutral-500)" }}
          >
            Loading contacts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-neutral-50)" }}
    >
      {/* ═══ Header ═══ */}
      <div
        className="border-b"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-600) 50%, var(--color-accent-500) 100%)",
          borderColor: "var(--color-primary-700)",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Contact Submissions
              </h1>
              <p className="text-sm text-white/80 mt-0.5">
                Manage and respond to community messages
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
              },
              {
                label: "Unread",
                value: stats.unread,
                icon: (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ),
              },
              {
                label: "Read",
                value: stats.read,
                icon: (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ),
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="text-white/80">{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/70">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Toolbar ═══ */}
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div
          className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border"
          style={{
            background: "white",
            borderColor: "var(--color-neutral-200)",
          }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-neutral-400)" }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, subject, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                border: "2px solid var(--color-neutral-200)",
                color: "var(--color-neutral-800)",
                background: "var(--color-neutral-50)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-primary-400)";
                e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-neutral-200)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div
            className="flex items-center rounded-xl overflow-hidden border"
            style={{ borderColor: "var(--color-neutral-200)" }}
          >
            {(["all", "unread", "read"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2.5 text-sm font-medium transition-all duration-200 capitalize"
                style={{
                  background:
                    filter === f ? "var(--color-primary-600)" : "white",
                  color: filter === f ? "white" : "var(--color-neutral-600)",
                }}
              >
                {f}
                {f === "unread" && stats.unread > 0 && (
                  <span
                    className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background:
                        filter === f
                          ? "rgba(255,255,255,0.25)"
                          : "var(--color-primary-100)",
                      color:
                        filter === f ? "white" : "var(--color-primary-700)",
                    }}
                  >
                    {stats.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer transition-all duration-200"
            style={{
              border: "2px solid var(--color-neutral-200)",
              color: "var(--color-neutral-700)",
              background: "white",
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchContacts}
            className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              border: "2px solid var(--color-neutral-200)",
              color: "var(--color-neutral-600)",
              background: "white",
            }}
            title="Refresh"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="max-w-[1600px] mx-auto px-6 pb-8">
        {filteredContacts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border"
            style={{
              background: "white",
              borderColor: "var(--color-neutral-200)",
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: "var(--color-primary-50)" }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--color-primary-400)" }}
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: "var(--color-neutral-800)" }}
            >
              {search ? "No matching contacts" : "No contacts yet"}
            </h3>
            <p
              className="text-sm"
              style={{ color: "var(--color-neutral-500)" }}
            >
              {search
                ? "Try adjusting your search or filters"
                : "Contact submissions will appear here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
            {/* ─── Contact List ─── */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "white",
                borderColor: "var(--color-neutral-200)",
              }}
            >
              <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                {filteredContacts.map((contact) => {
                  const subjectStyle = getSubjectColor(contact.subject);
                  const isSelected = selectedContact?.id === contact.id;

                  return (
                    <button
                      key={contact.id}
                      onClick={() => handleSelectContact(contact)}
                      className="w-full text-left p-4 border-b transition-all duration-200 hover:bg-opacity-50"
                      style={{
                        borderColor: "var(--color-neutral-100)",
                        background: isSelected
                          ? "var(--color-primary-50)"
                          : contact.isRead
                            ? "white"
                            : "var(--color-accent-50)",
                        borderLeft: isSelected
                          ? "3px solid var(--color-primary-500)"
                          : "3px solid transparent",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                          style={{
                            background: contact.isRead
                              ? "var(--color-neutral-100)"
                              : "var(--color-primary-100)",
                            color: contact.isRead
                              ? "var(--color-neutral-600)"
                              : "var(--color-primary-700)",
                          }}
                        >
                          {contact.user?.profileImage ? (
                            <img
                              src={contact.user.profileImage}
                              alt={contact.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials(contact.name)
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p
                              className={`text-sm truncate ${!contact.isRead ? "font-bold" : "font-medium"}`}
                              style={{ color: "var(--color-neutral-900)" }}
                            >
                              {contact.name}
                            </p>
                            <span
                              className="text-xs flex-shrink-0"
                              style={{ color: "var(--color-neutral-400)" }}
                            >
                              {formatDate(contact.createdAt)}
                            </span>
                          </div>

                          {contact.subject && (
                            <span
                              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1"
                              style={{
                                background: subjectStyle.bg,
                                color: subjectStyle.text,
                              }}
                            >
                              {contact.subject}
                            </span>
                          )}

                          <p
                            className="text-xs line-clamp-2"
                            style={{ color: "var(--color-neutral-500)" }}
                          >
                            {contact.message}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className="text-xs"
                              style={{ color: "var(--color-neutral-400)" }}
                            >
                              {contact.email}
                            </span>
                            {!contact.isRead && (
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{
                                  background: "var(--color-primary-500)",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── Detail Panel ─── */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "white",
                borderColor: "var(--color-neutral-200)",
              }}
            >
              {selectedContact ? (
                <div className="h-full flex flex-col">
                  {/* Detail Header */}
                  <div
                    className="px-6 py-5 border-b"
                    style={{ borderColor: "var(--color-neutral-100)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
                          style={{
                            background: "var(--color-primary-100)",
                            color: "var(--color-primary-700)",
                          }}
                        >
                          {selectedContact.user?.profileImage ? (
                            <img
                              src={selectedContact.user.profileImage}
                              alt={selectedContact.name}
                              className="w-full h-full rounded-2xl object-cover"
                            />
                          ) : (
                            getInitials(selectedContact.name)
                          )}
                        </div>
                        <div>
                          <h3
                            className="text-lg font-bold"
                            style={{ color: "var(--color-neutral-900)" }}
                          >
                            {selectedContact.name}
                          </h3>
                          <a
                            href={`mailto:${selectedContact.email}`}
                            className="text-sm hover:underline transition-colors"
                            style={{ color: "var(--color-primary-600)" }}
                          >
                            {selectedContact.email}
                          </a>
                          <div className="flex items-center gap-2 mt-1">
                            {selectedContact.user &&
                              (() => {
                                const badge = getUserTypeBadge(
                                  selectedContact.user.userType,
                                );
                                if (!badge) return null;
                                return (
                                  <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                    style={{
                                      background: badge.bg,
                                      color: badge.text,
                                    }}
                                  >
                                    {badge.label}
                                  </span>
                                );
                              })()}
                            {selectedContact.user && (
                              <span
                                className="text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{
                                  background: "var(--color-neutral-100)",
                                  color: "var(--color-neutral-600)",
                                }}
                              >
                                {selectedContact.user.role.replace("_", " ")}
                              </span>
                            )}
                            {!selectedContact.user && (
                              <span
                                className="text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{
                                  background: "var(--color-neutral-100)",
                                  color: "var(--color-neutral-500)",
                                }}
                              >
                                Visitor (not logged in)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(selectedContact)}
                          className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
                          style={{
                            border: "1.5px solid var(--color-neutral-200)",
                            color: selectedContact.isRead
                              ? "var(--color-neutral-500)"
                              : "var(--color-primary-600)",
                            background: "white",
                          }}
                          title={
                            selectedContact.isRead
                              ? "Mark as unread"
                              : "Mark as read"
                          }
                        >
                          {selectedContact.isRead ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                          ) : (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>

                        <a
                          href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your message"}`}
                          className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
                          style={{
                            border: "1.5px solid var(--color-primary-200)",
                            color: "var(--color-primary-600)",
                            background: "var(--color-primary-50)",
                          }}
                          title="Reply via email"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="9 17 4 12 9 7" />
                            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                          </svg>
                        </a>

                        {showDeleteConfirm === selectedContact.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(selectedContact.id)}
                              disabled={deletingId === selectedContact.id}
                              className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50"
                              style={{ background: "#dc2626" }}
                            >
                              {deletingId === selectedContact.id
                                ? "..."
                                : "Confirm"}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="p-2 rounded-xl transition-all duration-200"
                              style={{
                                border: "1.5px solid var(--color-neutral-200)",
                                color: "var(--color-neutral-500)",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setShowDeleteConfirm(selectedContact.id)
                            }
                            className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
                            style={{
                              border: "1.5px solid #fecaca",
                              color: "#dc2626",
                              background: "#fef2f2",
                            }}
                            title="Delete"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detail Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      {selectedContact.subject &&
                        (() => {
                          const style = getSubjectColor(
                            selectedContact.subject,
                          );
                          return (
                            <span
                              className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full"
                              style={{
                                background: style.bg,
                                color: style.text,
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                <line x1="7" y1="7" x2="7.01" y2="7" />
                              </svg>
                              {selectedContact.subject}
                            </span>
                          );
                        })()}

                      <span
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                        style={{
                          background: "var(--color-neutral-100)",
                          color: "var(--color-neutral-600)",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatFullDate(selectedContact.createdAt)}
                      </span>

                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                        style={{
                          background: selectedContact.isRead
                            ? "#f0fdf4"
                            : "var(--color-accent-100)",
                          color: selectedContact.isRead
                            ? "#16a34a"
                            : "var(--color-primary-700)",
                        }}
                      >
                        {selectedContact.isRead ? (
                          <>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Read
                          </>
                        ) : (
                          <>
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: "var(--color-primary-500)" }}
                            />
                            Unread
                          </>
                        )}
                      </span>
                    </div>

                    {/* Message */}
                    <div
                      className="rounded-2xl p-6 border"
                      style={{
                        background: "var(--color-neutral-50)",
                        borderColor: "var(--color-neutral-200)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ color: "var(--color-neutral-400)" }}
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "var(--color-neutral-400)" }}
                        >
                          Message
                        </span>
                      </div>
                      <p
                        className="text-[0.95rem] leading-relaxed whitespace-pre-wrap"
                        style={{ color: "var(--color-neutral-800)" }}
                      >
                        {selectedContact.message}
                      </p>
                    </div>

                    {/* Quick Reply */}
                    <div className="mt-6">
                      <PrimaryButton
                        as="a"
                        href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your message to Wake Up & Spark"}&body=%0A%0A──────────────────%0AOriginal message from ${selectedContact.name}:%0A${selectedContact.message}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Reply to {selectedContact.name.split(" ")[0]}
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "var(--color-primary-50)" }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "var(--color-primary-300)" }}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{ color: "var(--color-neutral-700)" }}
                  >
                    Select a message
                  </h3>
                  <p
                    className="text-sm max-w-xs text-center"
                    style={{ color: "var(--color-neutral-400)" }}
                  >
                    Choose a contact submission from the list to view its
                    details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
