"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    MessageSquare,
    LogOut,
} from "lucide-react";

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
    return (
        <Link
            href={href}
            className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        font-medium text-sm transition-all
        ${isActive
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md"
                    : "text-[var(--text-secondary)] hover:bg-[var(--primary-50)] hover:text-[var(--primary)]"
                }
      `}
        >
            <span className="w-5 h-5">{icon}</span>
            <span>{label}</span>
        </Link>
    );
}

export default function NavMenu() {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
        },
        {
            href: "/dashboard/products",
            icon: <Package size={20} />,
            label: "Products",
        },
        {
            href: "/dashboard/categories",
            icon: <FolderTree size={20} />,
            label: "Categories",
        },
        {
            href: "/dashboard/orders",
            icon: <ShoppingCart size={20} />,
            label: "Orders",
        },
        {
            href: "/dashboard/contacts",
            icon: <MessageSquare size={20} />,
            label: "Contact Submissions",
        },
    ];

    return (
        <nav
            className="w-64 min-h-screen border-r"
            style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
            }}
        >
            {/* Header */}
            <div
                className="px-6 py-6 border-b"
                style={{ borderColor: "var(--border)" }}
            >
                <h1
                    className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text"
                    style={{ WebkitTextFillColor: "transparent" }}
                >
                    🦐 Seefood
                </h1>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Admin Panel
                </p>
            </div>

            {/* Navigation Items */}
            <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={pathname === item.href}
                    />
                ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 w-64 px-4 py-4 border-t" style={{ borderColor: "var(--border)" }}>
                <button
                    onClick={() => {
                        // Add logout logic here
                        window.location.href = "/api/auth/logout";
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full
                     text-sm font-medium transition-all"
                    style={{
                        color: "var(--danger)",
                        backgroundColor: "var(--danger-light)",
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}