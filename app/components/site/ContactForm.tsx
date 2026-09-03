"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { submitContact } from "@/actions/contactActions";

const inp =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition";
const lbl = "text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setError("");
    setBusy(true);
    const res = await submitContact(form);
    setBusy(false);
    if (res.success) setSent(true);
    else setError(res.error ?? "Something went wrong.");
  }

  if (sent) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
        <div className="rounded-full bg-emerald-500/10 p-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)]">Message sent!</h3>
        <p className="max-w-sm text-sm text-[var(--color-muted)]">
          Thanks for reaching out, {form.name.split(" ")[0]}. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-5 rounded-3xl p-6 sm:p-8">
      {error && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={lbl}>Your Name</label>
          <input value={form.name} onChange={set("name")} placeholder="John Doe" className={inp} />
        </div>
        <div className="space-y-1.5">
          <label className={lbl}>Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="john@example.com"
            className={inp}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={lbl}>Subject</label>
        <input
          value={form.subject}
          onChange={set("subject")}
          placeholder="How can I help?"
          className={inp}
        />
      </div>

      <div className="space-y-1.5">
        <label className={lbl}>Tell me more</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell me about your project ideas..."
          className={inp}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-text)] py-3.5 text-sm font-bold uppercase tracking-widest text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {busy ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
