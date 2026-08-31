import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, ShoppingCart, Sparkles } from "lucide-react";

const WORK = [
  {
    title: "Flex Comfort Shoes",
    category: "E-commerce Platform",
    description:
      "A full-featured online store with cart, checkout, delivery fee management, and an admin dashboard for orders, products, and store settings.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    title: "Industrial Robotic Arm Control",
    category: "Embedded / Robotics",
    description:
      "A real-time C++ and Python control interface for a 6-axis robotic arm, supporting joint control and motion programming over a network.",
    tags: ["C++", "Python", "Robotics SDK"],
  },
  {
    title: "Automated Quality Inspection",
    category: "Embedded / AI",
    description:
      "An end-to-end defect detection system pairing an STM32-driven conveyor with a camera and an on-board AI model for real-time rejection.",
    tags: ["STM32", "Computer Vision", "AI/ML"],
  },
];

const SERVICES = [
  {
    icon: Code2,
    title: "Web & Software Development",
    description: "Custom web platforms and business software built with modern, maintainable stacks.",
  },
  {
    icon: Cpu,
    title: "Embedded & IoT Systems",
    description: "Firmware, sensors, and connected hardware for robotics and industrial automation.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description: "Online stores with checkout, inventory, and admin tooling tailored to your business.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-20 text-center">
          <Image
            src="/itvisionlogo.png"
            alt="IT Vision logo"
            width={160}
            height={160}
            className="h-32 w-32 object-contain sm:h-40 sm:w-40"
            priority
          />
          <div className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
            <Sparkles size={14} /> Software Development Company
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-[var(--color-text)] sm:text-5xl">
            We turn ideas into <span className="text-gradient">reliable software</span>
          </h1>
          <p className="max-w-xl text-base text-[var(--color-muted)] sm:text-lg">
            IT Vision designs and builds web platforms, e-commerce stores, and embedded &amp; robotics systems
            for businesses that want to move fast without cutting corners.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#work"
              className="gradient-flow glow-pulse inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              See Our Work <ArrowRight size={16} />
            </a>
            <Link
              href="/contact"
              className="glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-white/80"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>

      {/* Services snapshot */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass rounded-2xl p-6 transition hover:-translate-y-1">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-[var(--color-blue-dark)] to-[var(--color-blue-light)] p-3">
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-[var(--color-text)]">{title}</h3>
              <p className="mt-1.5 text-sm text-[var(--color-muted)]">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/products" className="text-sm font-bold text-[var(--color-accent)] hover:underline">
            Explore all our products &amp; services →
          </Link>
        </div>
      </section>

      {/* Our Work */}
      <section id="work" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Our Work</p>
            <h2 className="mt-2 text-3xl font-black text-[var(--color-text)]">Projects we&apos;re proud of</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--color-muted)]">
              A look at platforms and systems we&apos;ve shipped — from online stores to embedded robotics.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {WORK.map((item) => (
              <div
                key={item.title}
                className="glass group flex flex-col rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">{item.category}</p>
                <h3 className="mt-2 text-lg font-bold text-[var(--color-text)]">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-[var(--color-muted)]">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="glass-subtle rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--color-text)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="gradient-flow overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] px-8 py-14 text-center shadow-xl">
          <h2 className="text-2xl font-black text-white sm:text-3xl">Have a project in mind?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Tell us what you&apos;re building — we&apos;ll help you scope it, design it, and ship it.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--color-blue-dark)] shadow-sm transition hover:bg-[var(--color-bg)]"
          >
            Get in Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
