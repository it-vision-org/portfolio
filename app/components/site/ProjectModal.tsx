"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import type { PublicProject } from "@/lib/content";
import Lightbox from "./Lightbox";

function LinkButton({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof ExternalLink;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[var(--color-text)] transition hover:text-[var(--color-accent)]"
    >
      <Icon size={15} /> {children}
    </a>
  );
}

function MediaLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
      {children}
    </p>
  );
}

export default function ProjectModal({
  project,
  onClose,
}: {
  project: PublicProject | null;
  onClose: () => void;
}) {
  const [lb, setLb] = useState<{ images: string[]; start: number } | null>(null);

  useEffect(() => {
    if (!project) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && lb === null) onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose, lb]);

  if (!project) return null;

  const isWeb = project.category === "WEB";
  const isUiux = project.category === "UIUX";

  const buttons = [
    isWeb && project.liveUrl
      ? { href: project.liveUrl, icon: ExternalLink, label: "Live Demo" }
      : null,
    project.githubUrl ? { href: project.githubUrl, icon: Github, label: "GitHub Repo" } : null,
  ].filter(Boolean) as { href: string; icon: typeof ExternalLink; label: string }[];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong relative w-full max-w-3xl rounded-3xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full bg-black/10 p-2 text-[var(--color-text)] hover:bg-black/20"
        >
          <X size={20} />
        </button>

        {project.coverImageUrl && (
          <div className="mb-5 overflow-hidden rounded-2xl border border-[var(--color-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.coverImageUrl} alt={project.title} className="max-h-72 w-full object-cover" />
          </div>
        )}

        <h3 className="text-2xl font-black text-[var(--color-text)]">{project.title}</h3>
        {project.summary && (
          <p className="mt-1 text-sm font-semibold text-[var(--color-accent)]">{project.summary}</p>
        )}
        {project.description && (
          <p className="mt-3 whitespace-pre-line text-sm text-[var(--color-muted)]">
            {project.description}
          </p>
        )}

        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="glass-subtle rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--color-text)]"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {buttons.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {buttons.map((b) => (
              <LinkButton key={b.label} href={b.href} icon={b.icon}>
                {b.label}
              </LinkButton>
            ))}
          </div>
        )}

        {project.videoUrl && (
          <div className="mt-6">
            <MediaLabel>Video Demo</MediaLabel>
            <video
              src={project.videoUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-2xl border border-[var(--color-border)] bg-black"
            />
          </div>
        )}

        {isWeb && project.lighthouseImageUrl && (
          <div className="mt-6">
            <MediaLabel>Lighthouse Report</MediaLabel>
            <button
              onClick={() => setLb({ images: [project.lighthouseImageUrl!], start: 0 })}
              className="block w-full overflow-hidden rounded-2xl border border-[var(--color-border)] transition hover:-translate-y-0.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.lighthouseImageUrl} alt="Lighthouse report" className="w-full object-cover" />
            </button>
          </div>
        )}

        {isUiux && project.images.length > 0 && (
          <div className="mt-6">
            <MediaLabel>Figma Screens</MediaLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.images.map((im, idx) => (
                <button
                  key={im.url + idx}
                  onClick={() => setLb({ images: project.images.map((x) => x.url), start: idx })}
                  className="overflow-hidden rounded-xl border border-[var(--color-border)] transition hover:-translate-y-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.url} alt={im.caption ?? ""} className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {lb && (
        <Lightbox images={lb.images} startIndex={lb.start} onClose={() => setLb(null)} />
      )}
    </div>
  );
}
