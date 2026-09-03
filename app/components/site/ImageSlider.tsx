"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "./Lightbox";
import { useActiveTheme } from "./useActiveTheme";
import type { ThemeVisibility } from "@/types";

type Item = { imageUrl: string; title: string | null; theme?: ThemeVisibility };

const SLIDE_PCT = 64; // width of each slide as % of the track — the rest shows the neighbours

export default function ImageSlider({ items }: { items: Item[] }) {
  const active = useActiveTheme();
  const visible = items.filter(
    (it) => !it.theme || it.theme === "BOTH" || it.theme === active.toUpperCase(),
  );

  const [i, setI] = useState(0);
  const [box, setBox] = useState(false);

  useEffect(() => {
    if (i > visible.length - 1) setI(Math.max(0, visible.length - 1));
  }, [visible.length, i]);

  if (!visible.length) {
    return (
      <div className="glass-subtle flex h-56 items-center justify-center rounded-2xl text-sm text-[var(--color-muted)]">
        Nothing here yet.
      </div>
    );
  }

  const prev = () => setI((v) => (v - 1 + visible.length) % visible.length);
  const next = () => setI((v) => (v + 1) % visible.length);
  const current = visible[Math.min(i, visible.length - 1)]!;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex items-stretch transition-transform duration-300 ease-out"
            style={{ transform: `translateX(calc(${(100 - SLIDE_PCT) / 2}% - ${i * SLIDE_PCT}%))` }}
          >
            {visible.map((it, k) => (
              <div key={it.imageUrl + k} className="shrink-0 px-2" style={{ flexBasis: `${SLIDE_PCT}%` }}>
                <button
                  type="button"
                  onClick={() => (k === i ? setBox(true) : setI(k))}
                  aria-label={it.title ?? "Open image"}
                  className={`glass block w-full overflow-hidden rounded-2xl transition ${
                    k === i ? "" : "scale-95 opacity-40"
                  }`}
                >
                  <div className="flex aspect-video items-center justify-center bg-[var(--color-surface)]/40 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.imageUrl}
                      alt={it.title ?? ""}
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {visible.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="glass-strong absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-[var(--color-text)] sm:left-3"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="glass-strong absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-[var(--color-text)] sm:right-3"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--color-text)]">
          {current.title || `Item ${i + 1}`}
        </p>
        {visible.length > 1 && (
          <div className="flex gap-1.5">
            {visible.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Go to item ${k + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  k === i ? "w-5 bg-[var(--color-accent)]" : "w-1.5 bg-[var(--color-border)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {box && (
        <Lightbox
          images={visible.map((it) => it.imageUrl)}
          startIndex={i}
          onClose={() => setBox(false)}
        />
      )}
    </div>
  );
}
