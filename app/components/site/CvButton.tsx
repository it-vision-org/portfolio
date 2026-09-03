"use client";

import { useEffect, useState } from "react";
import { FileText, X, ExternalLink } from "lucide-react";

export default function CvButton({ url }: { url: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="gradient-flow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] px-7 py-3 text-sm font-bold text-white transition hover:opacity-90"
      >
        <FileText size={16} /> View Full CV
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[var(--color-surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <span className="text-sm font-bold text-[var(--color-text)]">Curriculum Vitae</span>
              <div className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] hover:opacity-80"
                >
                  <ExternalLink size={13} /> New tab
                </a>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-full bg-[var(--color-bg)] p-2 text-[var(--color-text)] hover:opacity-80"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <iframe
              src={`${url}#view=FitH`}
              title="Curriculum Vitae"
              className="min-h-0 flex-1 border-0 bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
}
