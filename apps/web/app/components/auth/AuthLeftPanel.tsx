"use client";

interface AuthLeftPanelProps {
  isRTL: boolean;
  title: string;
  subtitle: string;
  features: string[];
  tagline?: string;
  icon: React.ReactNode;
}

export function AuthLeftPanel({
  isRTL,
  title,
  subtitle,
  features,
  tagline,
  icon,
}: AuthLeftPanelProps) {
  return (
    <div
      className="hidden lg:flex lg:w-[46%] relative overflow-hidden items-center justify-center flex-col"
      style={{
        background:
          "linear-gradient(160deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)",
      }}
    >
      {/* Wave shapes */}
      <div
        className={`absolute top-[5%] w-[400px] h-[400px] rounded-full pointer-events-none animate-drift ${isRTL ? "left-[-15%]" : "right-[-15%]"}`}
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className={`absolute bottom-[5%] w-[350px] h-[350px] rounded-full pointer-events-none animate-drift-reverse ${isRTL ? "right-[-10%]" : "left-[-10%]"}`}
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floating dots */}
      {[
        { size: 6, x: "18%", y: "25%", delay: "0s" },
        { size: 4, x: "72%", y: "18%", delay: "1.5s" },
        { size: 8, x: "55%", y: "65%", delay: "0.8s" },
        { size: 5, x: "30%", y: "78%", delay: "2.5s" },
        { size: 3, x: "80%", y: "50%", delay: "1.2s" },
      ].map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none animate-float"
          style={{
            width: d.size,
            height: d.size,
            left: d.x,
            top: d.y,
            animationDelay: d.delay,
            background: "rgba(255,255,255,0.35)",
          }}
        />
      ))}

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />

      {/* Panel Content */}
      <div
        className={`relative z-10 px-12 text-center ${isRTL ? "text-right" : ""}`}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center animate-glow text-white"
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h1
          className="text-[2.6rem] leading-tight mb-4 font-bold whitespace-pre-line"
          style={{ color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.15 }}
        >
          {title}
        </h1>

        {/* Divider */}
        <div
          className="w-14 h-[2px] mx-auto mb-5 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          }}
        />

        {/* Subtitle */}
        <p
          className="text-[0.95rem] leading-relaxed max-w-[300px] mx-auto"
          style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}
        >
          {subtitle}
        </p>

        {/* Features */}
        <div
          className={`mt-10 max-w-[280px] mx-auto space-y-3 ${isRTL ? "text-right" : "text-left"}`}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span
                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.6)" }}
              />
              <span
                className="text-[0.9rem] font-light"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        {tagline && (
          <p
            className="mt-12 text-[0.75rem] uppercase tracking-[0.18em] font-medium"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {tagline}
          </p>
        )}
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 60 }}
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </div>
    </div>
  );
}
