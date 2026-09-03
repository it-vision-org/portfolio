"use server";

import { revalidatePath } from "next/cache";
import { db } from "@shoestore/db";
import { requireAdmin } from "@/lib/guard";
import type { ActionResult, ThemeVisibility } from "@/types";

export type ClientInput = { name: string; logoUrl: string; theme: ThemeVisibility }[];

export async function getAdminClients() {
  await requireAdmin();
  const rows = await db.client.findMany({ orderBy: { order: "asc" } });
  return rows.map((c) => ({
    id: c.id,
    name: c.name ?? "",
    logoUrl: c.logoUrl,
    theme: c.theme as ThemeVisibility,
  }));
}

export async function saveClients(items: ClientInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const clean = items
      .map((c) => ({
        name: c.name.trim() || null,
        logoUrl: c.logoUrl.trim(),
        theme: (["BOTH", "LIGHT", "DARK"] as const).includes(c.theme) ? c.theme : "BOTH",
      }))
      .filter((c) => c.logoUrl);

    await db.$transaction([
      db.client.deleteMany({}),
      ...(clean.length
        ? [db.client.createMany({ data: clean.map((c, order) => ({ ...c, order })) })]
        : []),
    ]);
    revalidatePath("/");
    revalidatePath("/admin/clients");
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[clients]", e);
    return { success: false, error: "Failed to save clients" };
  }
}
