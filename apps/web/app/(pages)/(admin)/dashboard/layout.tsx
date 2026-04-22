import "@/globals.css";
import { Toaster } from "react-hot-toast";
import NavMenu from "@/components/admin/NavMenu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh min-h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <NavMenu />

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto p-8"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {children}
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            padding: "14px 20px",
            fontSize: "0.9rem",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          },
          success: {
            iconTheme: {
              primary: "var(--color-primary-600)",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}