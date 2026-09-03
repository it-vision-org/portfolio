"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import {
  deleteProject,
  toggleProjectPublished,
  reorderProjects,
} from "@/actions/projectActions";
import { PROJECT_CATEGORY_LABELS, type ProjectCategory } from "@/types";
import { Card } from "./ui";
import { SortableList } from "./Sortable";

type Row = {
  id: string;
  title: string;
  category: ProjectCategory;
  isPublished: boolean;
  order: number;
  coverImageUrl: string | null;
  imageCount: number;
};

const GROUPS: ProjectCategory[] = ["WEB", "MOBILE", "UIUX"];

export default function ProjectsList({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);

  async function togglePub(r: Row) {
    setRows((c) => c.map((x) => (x.id === r.id ? { ...x, isPublished: !x.isPublished } : x)));
    const res = await toggleProjectPublished(r.id, !r.isPublished);
    if (!res.success) toast.error(res.error);
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await deleteProject(id);
    if (res.success) {
      setRows((c) => c.filter((x) => x.id !== id));
      toast.success("Deleted");
    } else toast.error(res.error);
  }

  async function reorder(cat: ProjectCategory, ordered: Row[]) {
    setRows((c) => [...c.filter((x) => x.category !== cat), ...ordered]);
    const res = await reorderProjects(ordered.map((x) => x.id));
    toast[res.success ? "success" : "error"](res.success ? "Order saved" : res.error);
  }

  return (
    <>
      {GROUPS.map((cat) => {
        const items = rows.filter((r) => r.category === cat);
        return (
          <Card key={cat} title={PROJECT_CATEGORY_LABELS[cat]}>
            {items.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No projects yet.</p>
            ) : (
              <SortableList
                items={items}
                getId={(r) => r.id}
                onReorder={(ordered) => reorder(cat, ordered)}
                className="space-y-2"
                renderItem={(r) => (
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-3">
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface)]/60">
                      {r.coverImageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.coverImageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[var(--color-text)]">{r.title}</p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {r.isPublished ? "published" : "hidden"}
                        {r.category === "UIUX" ? ` · ${r.imageCount} screens` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => togglePub(r)}
                      aria-label="Toggle published"
                      className={r.isPublished ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"}
                    >
                      {r.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <Link
                      href={`/admin/projects/${r.id}`}
                      aria-label="Edit"
                      className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => remove(r.id)}
                      aria-label="Delete"
                      className="text-[var(--color-muted)] hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              />
            )}
          </Card>
        );
      })}
    </>
  );
}
