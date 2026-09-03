"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2, Sun, Moon, SunMoon } from "lucide-react";
import { saveGraphicSection } from "@/actions/projectActions";
import {
  GRAPHIC_SECTION_LABELS,
  type GraphicSection,
  type ThemeVisibility,
} from "@/types";
import { Card, SaveButton, IconButton, field } from "./ui";
import { SortableList, uid } from "./Sortable";
import Uploader from "@/components/upload/Uploader";

type Row = { uid: string; title: string; imageUrl: string; theme: ThemeVisibility };
type Initial = Record<GraphicSection, { title: string; imageUrl: string; theme: ThemeVisibility }[]>;

const SECTIONS: GraphicSection[] = ["LOGO", "APP_ICON", "COVER", "POST"];

const THEME_OPTS: { value: ThemeVisibility; label: string; Icon: typeof Sun }[] = [
  { value: "BOTH", label: "Both", Icon: SunMoon },
  { value: "LIGHT", label: "Light", Icon: Sun },
  { value: "DARK", label: "Dark", Icon: Moon },
];

export default function GraphicEditor({ initial }: { initial: Initial }) {
  const [tab, setTab] = useState<GraphicSection>("LOGO");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === s
                ? "bg-[var(--color-accent)] text-white shadow-sm"
                : "glass-subtle text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {GRAPHIC_SECTION_LABELS[s]}
          </button>
        ))}
      </div>

      {/* keep all mounted so unsaved edits survive tab switches */}
      {SECTIONS.map((s) => (
        <div key={s} hidden={tab !== s}>
          <SectionCard section={s} initial={initial[s]} />
        </div>
      ))}
    </div>
  );
}

function SectionCard({
  section,
  initial,
}: {
  section: GraphicSection;
  initial: { title: string; imageUrl: string; theme: ThemeVisibility }[];
}) {
  const [rows, setRows] = useState<Row[]>(initial.map((r) => ({ ...r, uid: uid() })));
  const [busy, setBusy] = useState(false);

  const update = (u: string, patch: Partial<Row>) =>
    setRows((c) => c.map((x) => (x.uid === u ? { ...x, ...patch } : x)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveGraphicSection(
      section,
      rows.map(({ uid: _uid, ...r }) => r),
    );
    setBusy(false);
    toast[res.success ? "success" : "error"](res.success ? "Saved" : res.error);
  }

  return (
    <Card
      title={GRAPHIC_SECTION_LABELS[section]}
      actions={
        <Uploader
          endpoint="image"
          multiple
          buttonText="Add images"
          onComplete={(urls) =>
            setRows((c) => [
              ...c,
              ...urls.map((u) => ({ uid: uid(), title: "", imageUrl: u, theme: "BOTH" as ThemeVisibility })),
            ])
          }
        />
      }
    >
      <form onSubmit={save} className="space-y-3">
        {rows.length === 0 && <p className="text-sm text-[var(--color-muted)]">No images yet.</p>}

        <SortableList
          items={rows}
          getId={(r) => r.uid}
          onReorder={setRows}
          renderItem={(it) => (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border)] p-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-surface)]/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {it.imageUrl ? (
                  <img src={it.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                ) : null}
              </div>
              <input
                className={`${field} min-w-[140px] flex-1`}
                placeholder="Title (optional)"
                value={it.title}
                onChange={(e) => update(it.uid, { title: e.target.value })}
              />
              <div className="inline-flex overflow-hidden rounded-lg border border-[var(--color-border)]">
                {THEME_OPTS.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update(it.uid, { theme: value })}
                    title={`Show in ${label.toLowerCase()} mode`}
                    className={`inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold transition ${
                      it.theme === value
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
              <IconButton
                label="Remove"
                danger
                onClick={() => setRows((c) => c.filter((x) => x.uid !== it.uid))}
              >
                <Trash2 size={15} />
              </IconButton>
            </div>
          )}
        />

        <SaveButton busy={busy}>Save {GRAPHIC_SECTION_LABELS[section].toLowerCase()}</SaveButton>
      </form>
    </Card>
  );
}
