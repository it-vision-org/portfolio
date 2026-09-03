"use server";

import { revalidatePath } from "next/cache";
import { db } from "@shoestore/db";
import { requireAdmin } from "@/lib/guard";
import type { ActionResult, GraphicSection, ProjectCategory, ThemeVisibility } from "@/types";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export type ProjectInput = {
  title: string;
  category: ProjectCategory;
  summary: string;
  description: string;
  coverImageUrl: string | null;
  tags: string[];
  isPublished: boolean;
  order: number;
  liveUrl: string;
  videoUrl: string;
  githubUrl: string;
  lighthouseImageUrl: string;
  images: { url: string; caption: string }[];
};

function normalize(input: ProjectInput) {
  const url = (v: string) => v.trim() || null;
  return {
    title: input.title.trim(),
    category: input.category,
    summary: input.summary.trim() || null,
    description: input.description.trim() || null,
    coverImageUrl: input.coverImageUrl?.trim() || null,
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    isPublished: !!input.isPublished,
    order: Number.isFinite(input.order) ? input.order : 0,
    liveUrl: url(input.liveUrl),
    videoUrl: url(input.videoUrl),
    githubUrl: url(input.githubUrl),
    lighthouseImageUrl: url(input.lighthouseImageUrl),
    images: input.images.filter((i) => i.url?.trim()),
  };
}

export async function getAdminProjects() {
  await requireAdmin();
  const rows = await db.project.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { images: true } } },
  });
  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category as ProjectCategory,
    isPublished: p.isPublished,
    order: p.order,
    coverImageUrl: p.coverImageUrl,
    imageCount: p._count.images,
  }));
}

export async function getProjectForEdit(id: string) {
  await requireAdmin();
  const p = await db.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    category: p.category as ProjectCategory,
    summary: p.summary ?? "",
    description: p.description ?? "",
    coverImageUrl: p.coverImageUrl,
    tags: p.tags,
    isPublished: p.isPublished,
    order: p.order,
    liveUrl: p.liveUrl ?? "",
    videoUrl: p.videoUrl ?? "",
    githubUrl: p.githubUrl ?? "",
    lighthouseImageUrl: p.lighthouseImageUrl ?? "",
    images: p.images.map((i) => ({ url: i.url, caption: i.caption ?? "" })),
  };
}

export async function createProject(input: ProjectInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const data = normalize(input);
    if (!data.title) return { success: false, error: "Title is required" };

    const base = toSlug(data.title) || "project";
    const exists = await db.project.findUnique({ where: { slug: base } });
    const slug = exists ? `${base}-${Date.now().toString(36)}` : base;

    // Append new projects to the end of their category.
    const last = await db.project.findFirst({
      where: { category: data.category },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const { images, ...rest } = data;
    const created = await db.project.create({
      data: {
        ...rest,
        order: (last?.order ?? -1) + 1,
        slug,
        images: { create: images.map((im, order) => ({ url: im.url.trim(), caption: im.caption.trim() || null, order })) },
      },
    });
    revalidate();
    return { success: true, data: { id: created.id } };
  } catch (e) {
    console.error("[projects/create]", e);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, input: ProjectInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = normalize(input);
    if (!data.title) return { success: false, error: "Title is required" };

    const { images, ...rest } = data;
    await db.$transaction([
      db.projectImage.deleteMany({ where: { projectId: id } }),
      db.project.update({
        where: { id },
        data: {
          ...rest,
          images: { create: images.map((im, order) => ({ url: im.url.trim(), caption: im.caption.trim() || null, order })) },
        },
      }),
    ]);
    revalidate();
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[projects/update]", e);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.project.delete({ where: { id } });
    revalidate();
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[projects/delete]", e);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function toggleProjectPublished(id: string, value: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.project.update({ where: { id }, data: { isPublished: value } });
    revalidate();
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[projects/toggle]", e);
    return { success: false, error: "Failed to update project" };
  }
}

/** Persist a new display order for a set of projects (index in the array = order). */
export async function reorderProjects(orderedIds: string[]): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.$transaction(
      orderedIds.map((id, order) => db.project.update({ where: { id }, data: { order } })),
    );
    revalidate();
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[projects/reorder]", e);
    return { success: false, error: "Failed to save order" };
  }
}

// ── Graphic design items ─────────────────────────────────────
export type GraphicItemInput = {
  title: string;
  imageUrl: string;
  theme: ThemeVisibility;
}[];

type AdminGraphicItem = { title: string; imageUrl: string; theme: ThemeVisibility };

export async function getAdminGraphicItems() {
  await requireAdmin();
  const rows = await db.graphicItem.findMany({ orderBy: { order: "asc" } });
  const out: Record<GraphicSection, AdminGraphicItem[]> = {
    LOGO: [],
    APP_ICON: [],
    COVER: [],
    POST: [],
  };
  for (const r of rows)
    out[r.section as GraphicSection].push({
      title: r.title ?? "",
      imageUrl: r.imageUrl,
      theme: r.theme as ThemeVisibility,
    });
  return out;
}

export async function saveGraphicSection(
  section: GraphicSection,
  items: GraphicItemInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const clean = items
      .map((i) => ({
        title: i.title.trim() || null,
        imageUrl: i.imageUrl.trim(),
        theme: (["BOTH", "LIGHT", "DARK"] as const).includes(i.theme) ? i.theme : "BOTH",
        section,
      }))
      .filter((i) => i.imageUrl);

    await db.$transaction([
      db.graphicItem.deleteMany({ where: { section } }),
      ...(clean.length
        ? [db.graphicItem.createMany({ data: clean.map((i, order) => ({ ...i, order })) })]
        : []),
    ]);
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[graphic/save]", e);
    return { success: false, error: "Failed to save items" };
  }
}
