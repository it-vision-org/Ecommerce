import Link from "next/link";

type Props = {
  className?: string;
};

export function LoginButton({ className }: Props) {
  return (
    <Link
      href="/auth/login"
      className={
        className ||
        "text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      }
    >
      Login
    </Link>
  );
}