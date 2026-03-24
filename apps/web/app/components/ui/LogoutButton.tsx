"use client";

import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export function LogoutButton({ className }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={
        className ||
        "inline-flex w-full items-center justify-start rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      }
    >
      Logout
    </button>
  );
}