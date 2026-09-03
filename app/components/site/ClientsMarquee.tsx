"use client";

import { useActiveTheme } from "./useActiveTheme";
import type { Client } from "@/lib/content";

export default function ClientsMarquee({ clients }: { clients: Client[] }) {
  const active = useActiveTheme();
  const visible = clients.filter(
    (c) => !c.theme || c.theme === "BOTH" || c.theme === active.toUpperCase(),
  );

  if (visible.length === 0) {
    return (
      <p className="text-center text-sm text-[var(--color-muted)]">Client logos coming soon.</p>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="marquee gap-4 px-2">
        {[...visible, ...visible].map((c, i) => (
          <div
            key={c.id + "-" + i}
            className="glass flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.logoUrl}
              alt={c.name ?? "Client"}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
