"use client";

import React from "react";
import { Loader2, Save } from "lucide-react";

export const field =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition";
export const fieldLabel = "text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]";

export function PageTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-black text-[var(--color-text)]">{title}</h1>
      {desc && <p className="mt-1 text-sm text-[var(--color-muted)]">{desc}</p>}
    </div>
  );
}

export function Card({
  title,
  children,
  actions,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="glass mb-6 rounded-2xl p-6">
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-lg font-bold text-[var(--color-text)]">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className={fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

export function SaveButton({
  busy,
  children = "Save changes",
}: {
  busy: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="gradient-flow inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {busy ? "Saving…" : children}
    </button>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-subtle inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)]"
    >
      + {children}
    </button>
  );
}

export function IconButton({
  onClick,
  label,
  children,
  danger,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 transition hover:bg-[var(--color-surface)] ${
        danger ? "text-red-500 hover:border-red-400" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
      }`}
    >
      {children}
    </button>
  );
}
