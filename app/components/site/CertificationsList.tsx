"use client";

import { useCallback, useEffect, useState } from "react";
import { Award, Images, X, ChevronLeft, ChevronRight } from "lucide-react";

type Cert = { id: string; title: string; images: string[] };

export default function CertificationsList({ items }: { items: Cert[] }) {
  const [open, setOpen] = useState<Cert | null>(null);
  const [idx, setIdx] = useState(0);

  const show = (c: Cert) => {
    setIdx(0);
    setOpen(c);
  };

  if (!items.length) {
    return <p className="text-sm text-[var(--color-muted)]">No certifications yet.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((c) => {
        const hasImages = c.images.length > 0;
        return (
          <button
            key={c.id}
            type="button"
            disabled={!hasImages}
            onClick={() => hasImages && show(c)}
            className={`flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 px-4 py-3 text-left transition ${
              hasImages ? "hover:border-[var(--color-accent)] hover:-translate-y-0.5" : ""
            }`}
          >
            <Award size={18} className="shrink-0 text-[var(--color-accent)]" />
            <span className="flex-1 text-sm font-semibold text-[var(--color-text)]">{c.title}</span>
            {hasImages && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)]">
                <Images size={14} /> {c.images.length}
              </span>
            )}
          </button>
        );
      })}

      {open && (
        <CertModal
          cert={open}
          index={idx}
          onIndex={setIdx}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

function CertModal({
  cert,
  index,
  onIndex,
  onClose,
}: {
  cert: Cert;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const count = cert.images.length;
  const prev = useCallback(() => onIndex((index - 1 + count) % count), [index, count, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % count), [index, count, onIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong relative w-full max-w-2xl rounded-3xl p-4 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/10 p-2 text-[var(--color-text)] hover:bg-black/20"
        >
          <X size={18} />
        </button>

        <div className="relative flex items-center justify-center">
          {count > 1 && (
            <button
              onClick={prev}
              aria-label="Previous"
              className="glass-strong absolute left-1 rounded-full p-2 text-[var(--color-text)]"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cert.images[index]}
            alt={cert.title}
            className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain"
          />
          {count > 1 && (
            <button
              onClick={next}
              aria-label="Next"
              className="glass-strong absolute right-1 rounded-full p-2 text-[var(--color-text)]"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-text)]">{cert.title}</p>
          {count > 1 && (
            <span className="text-xs text-[var(--color-muted)]">
              {index + 1} / {count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
