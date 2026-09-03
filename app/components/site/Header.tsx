"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { id: "about", label: "About me" },
  { id: "resume", label: "Resume" },
  { id: "projects", label: "Projects" },
  { id: "clients", label: "Clients" },
  { id: "contact", label: "Contact" },
];

export function Header({ logoUrl }: { logoUrl: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toTop(e: React.MouseEvent) {
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="glass sticky top-4 z-50 mx-auto mt-4 w-[calc(100%-2rem)] max-w-6xl rounded-2xl">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" onClick={toTop} className="flex items-center gap-2" aria-label="Back to top">
          <Image
            src={logoUrl}
            alt="Ahmed Zouaghi"
            width={48}
            height={48}
            className="h-9 w-9 rounded-lg object-contain"
            priority
            unoptimized
          />
          <span className="hidden text-base font-black tracking-tight text-[var(--color-text)] sm:inline">
            Ahmed<span className="text-gradient"> Zouaghi</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => go(e, n.id)}
              className={`text-sm font-semibold transition ${
                active === n.id
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-[var(--color-text)] md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--color-border)] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => go(e, n.id)}
                className={`text-sm font-semibold ${
                  active === n.id ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"
                }`}
              >
                {n.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
