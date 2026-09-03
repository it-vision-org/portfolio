"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { saveServices, type ServiceInput } from "@/actions/serviceActions";
import { ICON_NAMES } from "@/components/site/icon-map";
import { Card, Labeled, SaveButton, AddButton, IconButton, field } from "./ui";
import { SortableList, uid } from "./Sortable";

type Svc = ServiceInput[number];
type Row = Svc & { uid: string };

const blank = (): Row => ({
  uid: uid(),
  title: "",
  description: "",
  icon: "Code2",
  features: [],
  isPublished: true,
});

export default function ServicesEditor({ initial }: { initial: Svc[] }) {
  const [rows, setRows] = useState<Row[]>(
    (initial.length ? initial : []).map((s) => ({ ...s, uid: uid() })),
  );
  const [busy, setBusy] = useState(false);

  const update = (u: string, patch: Partial<Row>) =>
    setRows((c) => c.map((x) => (x.uid === u ? { ...x, ...patch } : x)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveServices(rows.map(({ uid: _u, ...s }) => s));
    setBusy(false);
    toast[res.success ? "success" : "error"](res.success ? "Services saved" : res.error);
  }

  return (
    <Card actions={<AddButton onClick={() => setRows((c) => [...c, blank()])}>Add service</AddButton>}>
      <form onSubmit={save} className="space-y-4">
        <SortableList
          items={rows}
          getId={(r) => r.uid}
          onReorder={setRows}
          className="space-y-4"
          renderItem={(it) => (
            <div className="space-y-3 rounded-xl border border-[var(--color-border)] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_180px]">
                  <Labeled label="Title">
                    <input
                      className={field}
                      value={it.title}
                      onChange={(e) => update(it.uid, { title: e.target.value })}
                    />
                  </Labeled>
                  <Labeled label="Icon">
                    <select
                      className={field}
                      value={it.icon}
                      onChange={(e) => update(it.uid, { icon: e.target.value })}
                    >
                      {ICON_NAMES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </Labeled>
                </div>
                <IconButton
                  label="Remove"
                  danger
                  onClick={() => setRows((c) => c.filter((x) => x.uid !== it.uid))}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
              <Labeled label="Description">
                <textarea
                  rows={2}
                  className={field}
                  value={it.description}
                  onChange={(e) => update(it.uid, { description: e.target.value })}
                />
              </Labeled>
              <Labeled label="Features (comma separated)">
                <input
                  className={field}
                  value={it.features.join(", ")}
                  onChange={(e) =>
                    update(it.uid, {
                      features: e.target.value.split(",").map((f) => f.trim()).filter(Boolean),
                    })
                  }
                />
              </Labeled>
              <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <input
                  type="checkbox"
                  checked={it.isPublished}
                  onChange={(e) => update(it.uid, { isPublished: e.target.checked })}
                />
                Published
              </label>
            </div>
          )}
        />
        <SaveButton busy={busy}>Save services</SaveButton>
      </form>
    </Card>
  );
}
