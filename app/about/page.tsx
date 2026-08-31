import { Target, Eye, ShieldCheck, Rocket, Users, Lightbulb } from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Reliability",
    description: "We build systems that work the same way on day one thousand as they did on day one.",
  },
  {
    icon: Rocket,
    title: "Speed",
    description: "Lean processes and clear scope so your project ships without unnecessary delay.",
  },
  {
    icon: Lightbulb,
    title: "Craftsmanship",
    description: "Clean, maintainable code and thoughtful design — not just something that technically works.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We work alongside you, not just for you, from first sketch to long-term support.",
  },
];

const STATS = [
  { value: "10+", label: "Projects delivered" },
  { value: "4", label: "Engineering domains" },
  { value: "100%", label: "Client-focused" },
];

export default function AboutPage() {
  return (
    <main>
      {/* Intro */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">About Us</p>
          <h1 className="mt-2 text-4xl font-black text-[var(--color-text)] sm:text-5xl">
            We&apos;re <span className="text-gradient">IT Vision</span>
          </h1>
          <p className="mt-4 text-base text-[var(--color-muted)] sm:text-lg">
            A development team that bridges software and hardware — building web platforms, e-commerce
            stores, and embedded &amp; robotics systems for clients who need things to actually work in the
            real world.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="glass grid grid-cols-3 divide-x divide-white/40 rounded-2xl py-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-gradient sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--color-muted)] sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="glass rounded-2xl p-8">
            <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-[var(--color-blue-dark)] to-[var(--color-accent)] p-3">
              <Target size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Our Mission</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              To help businesses turn ambitious ideas into dependable products — whether that&apos;s a
              storefront, an internal tool, or a piece of connected hardware — without the usual friction of
              software projects.
            </p>
          </div>
          <div className="glass rounded-2xl p-8">
            <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-blue-light)] p-3">
              <Eye size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Our Vision</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              To be the team companies call when they need software and hardware to work together —
              recognized for technical depth, clear communication, and products that last.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">What Drives Us</p>
            <h2 className="mt-2 text-3xl font-black text-[var(--color-text)]">Our Values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="glass rounded-2xl p-6 transition hover:-translate-y-1">
                <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] p-2.5">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-bold text-[var(--color-text)]">{title}</h3>
                <p className="mt-1.5 text-sm text-[var(--color-muted)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
