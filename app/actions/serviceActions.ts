"use server";

import { revalidatePath } from "next/cache";
import { db } from "@shoestore/db";
import { requireAdmin } from "@/lib/guard";
import type { ActionResult } from "@/types";

export type ServiceInput = {
  title: string;
  description: string;
  icon: string;
  features: string[];
  isPublished: boolean;
}[];

export async function getAdminServices() {
  await requireAdmin();
  const rows = await db.service.findMany({ orderBy: { order: "asc" } });
  return rows.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    icon: s.icon,
    features: s.features,
    isPublished: s.isPublished,
  }));
}

export async function saveServices(items: ServiceInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const clean = items
      .map((s) => ({
        title: s.title.trim(),
        description: s.description.trim(),
        icon: s.icon.trim() || "Code2",
        features: s.features.map((f) => f.trim()).filter(Boolean),
        isPublished: !!s.isPublished,
      }))
      .filter((s) => s.title);

    await db.$transaction([
      db.service.deleteMany({}),
      ...(clean.length
        ? [db.service.createMany({ data: clean.map((s, order) => ({ ...s, order })) })]
        : []),
    ]);
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[services]", e);
    return { success: false, error: "Failed to save services" };
  }
}
