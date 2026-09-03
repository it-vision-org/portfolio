"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, Labeled, SaveButton, field } from "./ui";

export default function NewAccountForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [doneEmail, setDoneEmail] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create account");
      } else {
        setDoneEmail(form.email);
        setForm({ name: "", email: "", password: "" });
      }
    } catch {
      setError("Network error");
    }
    setBusy(false);
  }

  return (
    <Card>
      {doneEmail && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 size={16} /> Account created for {doneEmail}.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <Labeled label="Name">
          <input className={field} value={form.name} onChange={set("name")} />
        </Labeled>
        <Labeled label="Email">
          <input className={field} type="email" value={form.email} onChange={set("email")} />
        </Labeled>
        <Labeled label="Password">
          <input
            className={field}
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="At least 6 characters"
          />
        </Labeled>
        <SaveButton busy={busy}>Create account</SaveButton>
      </form>
    </Card>
  );
}
