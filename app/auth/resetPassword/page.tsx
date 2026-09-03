"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authButton, authInput, authLabel } from "@/components/auth/authStyles";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords don't match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
        setBusy(false);
        return;
      }
      router.replace("/auth/login?registered=1");
    } catch {
      setError("Network error");
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="text-lg font-black text-[var(--color-text)]">Invalid link</h1>
        <p className="text-sm text-[var(--color-muted)]">This reset link is missing its token.</p>
        <Link href="/auth/forgetPassword" className="text-sm text-[var(--color-accent)] hover:underline">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-[var(--color-text)]">Set a new password</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className={authLabel}>New password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={authInput}
          placeholder="••••••••"
        />
      </div>
      <div className="space-y-1.5">
        <label className={authLabel}>Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={authInput}
          placeholder="••••••••"
        />
      </div>

      <button type="submit" disabled={busy} className={authButton}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}
