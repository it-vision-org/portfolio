"use server";

import { revalidatePath } from "next/cache";
import { db } from "@shoestore/db";
import { requireAdmin } from "@/lib/guard";
import type { ActionResult } from "@/types";

// Non-nullable text columns — an empty submission is stored as "".
const TEXT_FIELDS = [
  "heroName",
  "heroTitle",
  "heroTagline",
  "heroCtaText",
  "aboutHeading",
  "aboutText",
  "resumeHeading",
  "contactHeading",
  "contactText",
  "contactEmail",
  "footerText",
] as const;

// Nullable columns — an empty submission is stored as null.
const NULLABLE_FIELDS = [
  "navbarLogoUrl",
  "homeLogoUrl",
  "aboutImageUrl",
  "cvPdfUrl",
  "whatsappNumber",
  "whatsappLabel",
  "phoneNumber",
  "phoneLabel",
  "primaryLocation",
  "currentResidency",
  "githubUrl",
  "linkedinUrl",
  "instagramUrl",
  "youtubeUrl",
] as const;

type Key = (typeof TEXT_FIELDS)[number] | (typeof NULLABLE_FIELDS)[number];
export type SiteSettingsInput = Partial<Record<Key, string | null>>;

export async function updateSiteSettings(input: SiteSettingsInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data: Record<string, string | null> = {};
    for (const key of TEXT_FIELDS) {
      if (key in input) data[key] = (input[key] ?? "").toString().trim();
    }
    for (const key of NULLABLE_FIELDS) {
      if (key in input) {
        const v = (input[key] ?? "").toString().trim();
        data[key] = v || null;
      }
    }
    await db.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    revalidatePath("/");
    revalidatePath("/admin/basic-info");
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[siteSettings]", e);
    return { success: false, error: "Failed to save settings" };
  }
}
