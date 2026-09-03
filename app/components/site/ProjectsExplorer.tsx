"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PublicProject, GraphicItems } from "@/lib/content";
import type { ProjectCategory, GraphicSection } from "@/types";
import { PROJECT_CATEGORY_LABELS, GRAPHIC_SECTION_LABELS } from "@/types";
import ProjectModal from "./ProjectModal";
import ImageSlider from "./ImageSlider";

const TABS: ProjectCategory[] = ["WEB", "MOBILE", "UIUX", "GRAPHIC"];
const GRAPHIC_TABS: GraphicSection[] = ["LOGO", "APP_ICON", "COVER", "POST"];

function pill(activeState: boolean) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${
    activeState
      ? "gradient-flow bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] text-white shadow-md"
      : "glass-subtle text-[var(--color-muted)] hover:text-[var(--color-text)]"
  }`;
}

export default function ProjectsExplorer({
  projects,
  graphic,
}: {
  projects: PublicProject[];
  graphic: GraphicItems;
}) {
  const [tab, setTab] = useState<ProjectCategory>("WEB");
  const [gtab, setGtab] = useState<GraphicSection>("LOGO");
  const [open, setOpen] = useState<PublicProject | null>(null);

  const list = projects.filter((p) => p.category === tab);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2.5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={pill(tab === t)}>
            {PROJECT_CATEGORY_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "GRAPHIC" ? (
        <div>
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {GRAPHIC_TABS.map((g) => (
              <button key={g} onClick={() => setGtab(g)} className={pill(gtab === g)}>
                {GRAPHIC_SECTION_LABELS[g]}
              </button>
            ))}
          </div>
          <div className="mx-auto max-w-2xl">
            <ImageSlider items={graphic[gtab]} />
          </div>
        </div>
      ) : list.length === 0 ? (
        <p className="text-center text-sm text-[var(--color-muted)]">
          Projects in this category are coming soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpen(p)}
              className="glass group flex flex-col overflow-hidden rounded-2xl text-left transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-video w-full overflow-hidden bg-[var(--color-surface)]/40">
                {p.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.coverImageUrl}
                    alt={p.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {PROJECT_CATEGORY_LABELS[p.category]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-[var(--color-text)]">{p.title}</h3>
                {p.summary && (
                  <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-[var(--color-muted)]">
                    {p.summary}
                  </p>
                )}
                {p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="glass-subtle rounded-full px-2 py-0.5 text-[11px] font-semibold text-[var(--color-text)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-accent)]">
                  View Details <ArrowUpRight size={15} />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </div>
  );
}
