import Link from "next/link";
import { Globe, ShoppingCart, Cpu, Bot, Check, ArrowRight } from "lucide-react";

const PRODUCTS = [
  {
    icon: Globe,
    title: "Custom Web Platforms",
    tagline: "Software built around how your business actually works",
    description:
      "From internal dashboards to client-facing portals, we design and build web applications tailored to your workflow instead of forcing you into a generic template.",
    features: [
      "Tailored to your exact business logic",
      "Admin dashboards with real-time data",
      "Built to scale as you grow",
    ],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    tagline: "Sell online without fighting your platform",
    description:
      "Full online stores with cart, checkout, delivery management, and an admin panel for products, orders, and settings — so you can run the business, not the software.",
    features: [
      "Cart, checkout & order management",
      "Configurable delivery & pricing rules",
      "Admin dashboard for day-to-day control",
    ],
  },
  {
    icon: Cpu,
    title: "Embedded & IoT Systems",
    tagline: "Hardware that talks to software, reliably",
    description:
      "Firmware and connected-device solutions — sensors, controllers, and dashboards — for monitoring and automating physical processes in real time.",
    features: [
      "Real-time sensor & actuator control",
      "Cloud-connected monitoring dashboards",
      "Built on STM32, ESP32 & Arduino platforms",
    ],
  },
  {
    icon: Bot,
    title: "Robotics & Automation",
    tagline: "From concept to a working robotic system",
    description:
      "Control software and integration for robotic arms, automated inspection lines, and custom motion systems — combining mechanical, electrical, and software expertise.",
    features: [
      "Real-time motion & joint control",
      "AI-assisted vision & inspection",
      "End-to-end system integration",
    ],
  },
];

export default function ProductsPage() {
  return (
    <main>
      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Our Products</p>
          <h1 className="mt-2 text-4xl font-black text-[var(--color-text)] sm:text-5xl">
            What we <span className="text-gradient">build</span> for you
          </h1>
          <p className="mt-4 text-base text-[var(--color-muted)] sm:text-lg">
            Every engagement is tailored, but our work falls into four core areas — each built to deliver
            real, measurable value to your business.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {PRODUCTS.map(({ icon: Icon, title, tagline, description, features }) => (
            <div key={title} className="glass flex flex-col rounded-2xl p-7 transition hover:-translate-y-1">
              <div className="mb-4 inline-flex w-fit rounded-xl bg-gradient-to-br from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] p-3">
                <Icon size={22} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">{title}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--color-accent)]">{tagline}</p>
              <p className="mt-3 text-sm text-[var(--color-muted)]">{description}</p>
              <ul className="mt-4 space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-text)]">
                    <Check size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-2xl font-black text-[var(--color-text)] sm:text-3xl">
          Not sure which fits your project?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-muted)]">
          Tell us what you&apos;re trying to build — we&apos;ll help you figure out the right approach.
        </p>
        <Link
          href="/contact"
          className="gradient-flow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
        >
          Talk to Us <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
