"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2, X, ImagePlus, Sun, Moon, SunMoon } from "lucide-react";
import { saveClients } from "@/actions/clientActions";
import type { ThemeVisibility } from "@/types";
import { Card, SaveButton, IconButton, field } from "./ui";
import { SortableList, uid } from "./Sortable";
import Uploader from "@/components/upload/Uploader";

type Row = { uid: string; name: string; logoUrl: string; theme: ThemeVisibility };
type LogoOption = { imageUrl: string; theme: ThemeVisibility };

const THEME_OPTS: { value: ThemeVisibility; label: string; Icon: typeof Sun }[] = [
  { value: "BOTH", label: "Both", Icon: SunMoon },
  { value: "LIGHT", label: "Light", Icon: Sun },
  { value: "DARK", label: "Dark", Icon: Moon },
];

export default function ClientsEditor({
  initial,
  logoOptions = [],
}: {
  initial: { name: string; logoUrl: string; theme: ThemeVisibility }[];
  logoOptions?: LogoOption[];
}) {
  const [rows, setRows] = useState<Row[]>(initial.map((r) => ({ ...r, uid: uid() })));
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);

  const update = (u: string, patch: Partial<Row>) =>
    setRows((c) => c.map((x) => (x.uid === u ? { ...x, ...patch } : x)));

  const addLogos = (items: { logoUrl: string; theme: ThemeVisibility }[]) =>
    setRows((c) => [...c, ...items.map((it) => ({ uid: uid(), name: "", ...it }))]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveClients(rows.map(({ uid: _u, ...r }) => r));
    setBusy(false);
    toast[res.success ? "success" : "error"](res.success ? "Clients saved" : res.error);
  }

  return (
    <Card
      actions={
        <div className="flex flex-wrap gap-2">
          {logoOptions.length > 0 && (
            <button
              type="button"
              onClick={() => setPicker(true)}
              className="glass-subtle inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)]"
            >
              <ImagePlus size={15} /> Select from Logos
            </button>
          )}
          <Uploader
            endpoint="image"
            multiple
            buttonText="Add logos"
            onComplete={(urls) =>
              addLogos(urls.map((u) => ({ logoUrl: u, theme: "BOTH" as ThemeVisibility })))
            }
          />
        </div>
      }
    >
      <form onSubmit={save} className="space-y-3">
        {rows.length === 0 && (
          <p className="text-sm text-[var(--color-muted)]">
            No clients yet — upload logos or pick from the Graphic Design → Logos section.
          </p>
        )}
        <SortableList
          items={rows}
          getId={(r) => r.uid}
          onReorder={setRows}
          renderItem={(r) => (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border)] p-3">
              <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-surface)]/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {r.logoUrl ? (
                  <img src={r.logoUrl} alt="" className="max-h-full max-w-full object-contain" />
                ) : null}
              </div>
              <input
                className={`${field} min-w-[140px] flex-1`}
                placeholder="Client name (optional)"
                value={r.name}
                onChange={(e) => update(r.uid, { name: e.target.value })}
              />
              <div className="inline-flex overflow-hidden rounded-lg border border-[var(--color-border)]">
                {THEME_OPTS.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update(r.uid, { theme: value })}
                    title={`Show in ${label.toLowerCase()} mode`}
                    className={`inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold transition ${
                      r.theme === value
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
              <IconButton label="Remove" danger onClick={() => setRows((c) => c.filter((x) => x.uid !== r.uid))}>
                <Trash2 size={15} />
              </IconButton>
            </div>
          )}
        />
        <SaveButton busy={busy}>Save clients</SaveButton>
      </form>

      {picker && (
        <LogoPicker
          options={logoOptions}
          used={rows.map((r) => r.logoUrl)}
          onPick={(opt) => addLogos([{ logoUrl: opt.imageUrl, theme: opt.theme }])}
          onClose={() => setPicker(false)}
        />
      )}
    </Card>
  );
}

function LogoPicker({
  options,
  used,
  onPick,
  onClose,
}: {
  options: LogoOption[];
  used: string[];
  onPick: (opt: LogoOption) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full bg-black/10 p-2 text-[var(--color-text)] hover:bg-black/20"
        >
          <X size={18} />
        </button>
        <h3 className="mb-1 text-lg font-bold text-[var(--color-text)]">Logos section images</h3>
        <p className="mb-4 text-xs text-[var(--color-muted)]">
          Click an image to add it as a client logo (its theme setting comes along).
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {options.map((opt) => {
            const isUsed = used.includes(opt.imageUrl);
            return (
              <button
                key={opt.imageUrl}
                type="button"
                onClick={() => onPick(opt)}
                className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border p-2 transition hover:border-[var(--color-accent)] ${
                  isUsed ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
                } bg-[var(--color-surface)]/60`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={opt.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                {opt.theme !== "BOTH" && (
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1 py-0.5 text-[10px] font-bold text-white">
                    {opt.theme === "DARK" ? "dark" : "light"}
                  </span>
                )}
                {isUsed && (
                  <span className="absolute bottom-1 right-1 rounded bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    added
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
