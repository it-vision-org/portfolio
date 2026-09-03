"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createProject, updateProject, type ProjectInput } from "@/actions/projectActions";
import { PROJECT_CATEGORY_LABELS, type ProjectCategory } from "@/types";
import { Card, Labeled, SaveButton, field } from "./ui";
import ImageField from "@/components/upload/ImageField";
import MultiImageField from "@/components/upload/MultiImageField";
import VideoField from "@/components/upload/VideoField";

const CATEGORIES: ProjectCategory[] = ["WEB", "MOBILE", "UIUX"];

export type ProjectFormValue = ProjectInput & { id?: string };

const EMPTY: ProjectInput = {
  title: "",
  category: "WEB",
  summary: "",
  description: "",
  coverImageUrl: null,
  tags: [],
  isPublished: true,
  order: 0,
  liveUrl: "",
  videoUrl: "",
  githubUrl: "",
  lighthouseImageUrl: "",
  images: [],
};

export default function ProjectForm({ initial }: { initial?: ProjectFormValue }) {
  const router = useRouter();
  const editingId = initial?.id;
  const [v, setV] = useState<ProjectInput>({ ...EMPTY, ...initial });
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ProjectInput>(k: K, val: ProjectInput[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!v.title.trim()) return toast.error("Title is required");
    setBusy(true);
    const res = editingId ? await updateProject(editingId, v) : await createProject(v);
    setBusy(false);
    if (res.success) {
      toast.success(editingId ? "Saved" : "Created");
      router.push("/admin/projects");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  const isWeb = v.category === "WEB";
  const isMobile = v.category === "MOBILE";
  const isUiux = v.category === "UIUX";

  return (
    <form onSubmit={onSubmit}>
      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Title">
            <input className={field} value={v.title} onChange={(e) => set("title", e.target.value)} />
          </Labeled>
          <Labeled label="Category">
            <select
              className={field}
              value={v.category}
              onChange={(e) => set("category", e.target.value as ProjectCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {PROJECT_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Summary (card line)">
            <input className={field} value={v.summary} onChange={(e) => set("summary", e.target.value)} />
          </Labeled>
        </div>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          Display order is set by dragging cards on the Projects list.
        </p>
        <div className="mt-4">
          <Labeled label="Description (modal)">
            <textarea
              rows={4}
              className={field}
              value={v.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Labeled>
        </div>
        <div className="mt-4">
          <Labeled label="Tags (comma separated)">
            <input
              className={field}
              value={v.tags.join(", ")}
              onChange={(e) =>
                set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))
              }
            />
          </Labeled>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            checked={v.isPublished}
            onChange={(e) => set("isPublished", e.target.checked)}
          />
          Published
        </label>
      </Card>

      <Card title="Cover image">
        <ImageField
          value={v.coverImageUrl}
          onChange={(u) => set("coverImageUrl", u)}
          hint="Shown on the project card and at the top of the modal."
        />
      </Card>

      {(isWeb || isMobile) && (
        <Card title="Links">
          <div className="grid gap-4 sm:grid-cols-2">
            {isWeb && (
              <Labeled label="Live website URL">
                <input className={field} value={v.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} />
              </Labeled>
            )}
            <Labeled label="GitHub repo URL">
              <input className={field} value={v.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
            </Labeled>
          </div>
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            A button only appears when its URL is filled in.
          </p>
        </Card>
      )}

      {(isWeb || isMobile || isUiux) && (
        <Card title="Video demo">
          <VideoField
            value={v.videoUrl || null}
            onChange={(u) => set("videoUrl", u ?? "")}
            hint="Uploaded to UploadThing and played inline in the project modal."
          />
        </Card>
      )}

      {isWeb && (
        <Card title="Lighthouse report">
          <ImageField
            value={v.lighthouseImageUrl || null}
            onChange={(u) => set("lighthouseImageUrl", u ?? "")}
            hint="Upload a screenshot of the report — shown in the modal, click to enlarge."
          />
        </Card>
      )}

      {isUiux && (
        <Card title="Figma screenshots">
          <MultiImageField
            values={v.images.map((i) => i.url)}
            onChange={(urls) => set("images", urls.map((url) => ({ url, caption: "" })))}
            hint="Shown as a grid in the modal; clicking opens the gallery"
          />
        </Card>
      )}

      <div className="flex justify-end">
        <SaveButton busy={busy}>{editingId ? "Save project" : "Create project"}</SaveButton>
      </div>
    </form>
  );
}
