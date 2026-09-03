"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { authButton, authInput, authLabel } from "@/components/auth/authStyles";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Request failed");
        setBusy(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-emerald-500/10 p-3">
          <MailCheck className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-lg font-black text-[var(--color-text)]">Check your email</h1>
        <p className="text-sm text-[var(--color-muted)]">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
        <Link href="/auth/login" className="mt-2 text-sm text-[var(--color-accent)] hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-[var(--color-text)]">Reset password</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className={authLabel}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInput}
          placeholder="you@example.com"
        />
      </div>

      <button type="submit" disabled={busy} className={authButton}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? "Sending…" : "Send reset link"}
      </button>

      <p className="text-center text-sm">
        <Link href="/auth/login" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
