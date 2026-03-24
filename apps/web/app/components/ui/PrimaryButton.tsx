import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;
  fullWidth?: boolean;
};

type ButtonProps = BaseProps & {
  as?: "button";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

type AnchorProps = BaseProps & {
  as: "a";
  href: string;
};

type PrimaryButtonProps = ButtonProps | AnchorProps;

export default function PrimaryButton(props: PrimaryButtonProps) {
  const {
    children,
    className = "",
    disabled = false,
    loading = false,
    loadingText,
    fullWidth = false,
  } = props;

  const baseClass = `
    inline-flex items-center justify-center gap-2
    px-6 py-3 rounded-xl
    text-sm font-semibold text-white
    bg-gradient-to-r from-[#2563eb] to-[#3b82f6]
    shadow-lg shadow-[#2563eb]/25
    transition-all duration-300
    hover:scale-[1.02] hover:shadow-xl
    disabled:opacity-60 disabled:hover:scale-100
    ${fullWidth ? "w-full" : ""}
    ${className}
  `.trim();

  const content = loading ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      {loadingText ?? children}
    </>
  ) : (
    children
  );

  if (props.as === "a") {
    return (
      <a href={props.href} className={baseClass}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={disabled || loading}
      className={baseClass}
    >
      {content}
    </button>
  );
}