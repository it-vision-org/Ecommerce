import "@/globals.css";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
      {children}
    </>
  );
}
