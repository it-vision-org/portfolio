"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variant = "solid" | "glass" | "ghost";

type Props = {
  as?: "button" | "link";
  href?: string;
  loading?: boolean;
  loadingText?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid:
    "gradient-flow text-white shadow-md hover:opacity-90 bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)]",
  glass: "glass-strong text-[var(--color-text)] hover:bg-white/80",
  ghost:
    "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/60",
};

export default function PrimaryButton({
  as = "button",
  href,
  loading,
  loadingText,
  variant = "solid",
  className = "",
  children,
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span className="inline-flex items-center gap-2">
        {loading && loadingText ? loadingText : children}
      </span>
    </>
  );

  if (as === "link" && href) {
    return (
      <Link href={href} className={cls} target={rest.target} rel={rest.rel} aria-label={rest["aria-label"]}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      className={cls}
      type={rest.type ?? "button"}
      onClick={rest.onClick}
      disabled={loading || rest.disabled}
      aria-label={rest["aria-label"]}
    >
      {inner}
    </button>
  );
}
