"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authButton, authInput, authLabel } from "@/components/auth/authStyles";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setBusy(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-[var(--color-text)]">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Access the portfolio backoffice.</p>
      </div>

      {params.get("registered") && (
        <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
          Account created — you can sign in now.
        </div>
      )}
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
      <div className="space-y-1.5">
        <label className={authLabel}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={authInput}
          placeholder="••••••••"
        />
      </div>

      <button type="submit" disabled={busy} className={authButton}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <div className="text-sm">
        <Link href="/auth/forgetPassword" className="text-[var(--color-accent)] hover:underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
