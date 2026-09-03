"use client";

import { X, ImageIcon } from "lucide-react";
import Uploader from "./Uploader";

export default function ImageField({
  value,
  onChange,
  endpoint = "image",
  label,
  hint,
  aspect = "aspect-video",
  rounded = "rounded-xl",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  endpoint?: "image" | "logo";
  label?: string;
  hint?: string;
  aspect?: string;
  rounded?: string;
}) {
  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-bold text-[var(--color-text)]">{label}</p>}
      <div className="flex flex-wrap items-start gap-4">
        <div
          className={`relative flex ${aspect} w-40 shrink-0 items-center justify-center overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]/60 ${rounded}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label ?? "image"} className="h-full w-full object-contain" />
          ) : (
            <ImageIcon className="h-8 w-8 text-[var(--color-muted)] opacity-40" />
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          <Uploader
            endpoint={endpoint}
            buttonText={value ? "Replace" : "Upload"}
            onComplete={(urls) => onChange(urls[0] ?? null)}
          />
          {hint && <p className="max-w-xs text-xs text-[var(--color-muted)]">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
