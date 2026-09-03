"use client";

import { X, Video as VideoIcon } from "lucide-react";
import Uploader from "./Uploader";

export default function VideoField({
  value,
  onChange,
  label,
  hint = "MP4 / WebM. Plays inline on the project card — no external site.",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-bold text-[var(--color-text)]">{label}</p>}
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative flex aspect-video w-56 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60">
          {value ? (
            <video key={value} src={value} controls className="h-full w-full object-contain" />
          ) : (
            <VideoIcon className="h-8 w-8 text-[var(--color-muted)] opacity-40" />
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Remove video"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          <Uploader
            endpoint="video"
            buttonText={value ? "Replace video" : "Upload video"}
            onComplete={(urls) => onChange(urls[0] ?? null)}
          />
          {hint && <p className="max-w-xs text-xs text-[var(--color-muted)]">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
