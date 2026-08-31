"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";

const inp =
  "w-full rounded-xl border border-white/50 bg-white/60 px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setError("");
    setSubmitting(true);

    // Front-end only for now — no backend wired up yet.
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
        <div className="rounded-full bg-emerald-50 p-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)]">Message sent!</h3>
        <p className="max-w-sm text-sm text-[var(--color-muted)]">
          Thanks for reaching out, {name.split(" ")[0]}. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6 sm:p-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[var(--color-text)]">Full Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inp} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[var(--color-text)]">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inp}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[var(--color-text)]">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What's this about?"
          className={inp}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[var(--color-text)]">Message *</label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your project..."
          className={inp}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="gradient-flow inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-blue)] to-[var(--color-blue-light)] py-3.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
