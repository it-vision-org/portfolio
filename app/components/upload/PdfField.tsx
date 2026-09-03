"use client";

import { FileText, X } from "lucide-react";
import Uploader from "./Uploader";

export default function PdfField({
  value,
  onChange,
  label = "CV / Resume (PDF)",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-[var(--color-text)]">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-2 text-sm font-semibold text-[var(--color-accent)]"
          >
            <FileText className="h-4 w-4" /> View current PDF
          </a>
        ) : (
          <span className="text-sm text-[var(--color-muted)]">No PDF uploaded</span>
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-red-600"
          >
            <X className="h-4 w-4" /> Remove
          </button>
        )}
        <Uploader
          endpoint="pdf"
          buttonText={value ? "Replace PDF" : "Upload PDF"}
          onComplete={(urls) => onChange(urls[0] ?? null)}
        />
      </div>
    </div>
  );
}
