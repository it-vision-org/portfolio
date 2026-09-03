"use server";

import { revalidatePath } from "next/cache";
import { db } from "@shoestore/db";
import { requireAdmin } from "@/lib/guard";
import type { ActionResult } from "@/types";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/resume");
}

// ── Skills ────────────────────────────────────────────────────
export type SkillsInput = { name: string; skills: string[] }[];

export async function saveSkills(categories: SkillsInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const clean = categories
      .map((c) => ({
        name: c.name.trim(),
        skills: c.skills.map((s) => s.trim()).filter(Boolean),
      }))
      .filter((c) => c.name);

    await db.$transaction([
      db.skillCategory.deleteMany({}),
      ...clean.map((c, i) =>
        db.skillCategory.create({
          data: {
            name: c.name,
            order: i,
            skills: { create: c.skills.map((name, order) => ({ name, order })) },
          },
        }),
      ),
    ]);
    revalidate();
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[resume/skills]", e);
    return { success: false, error: "Failed to save skills" };
  }
}

// ── Education ─────────────────────────────────────────────────
export type EducationInput = {
  degree: string;
  institution: string;
  period: string;
  description: string;
}[];

export async function saveEducation(items: EducationInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const clean = items
      .map((e) => ({
        degree: e.degree.trim(),
        institution: e.institution.trim(),
        period: e.period.trim(),
        description: e.description.trim() || null,
      }))
      .filter((e) => e.degree);

    await db.$transaction([
      db.education.deleteMany({}),
      ...(clean.length
        ? [db.education.createMany({ data: clean.map((e, order) => ({ ...e, order })) })]
        : []),
    ]);
    revalidate();
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[resume/education]", e);
    return { success: false, error: "Failed to save education" };
  }
}

// ── Certifications ───────────────────────────────────────────
export type CertificationsInput = { title: string; images: string[] }[];

export async function saveCertifications(items: CertificationsInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const clean = items
      .map((c) => ({ title: c.title.trim(), images: c.images.filter(Boolean) }))
      .filter((c) => c.title);

    await db.$transaction([
      db.certification.deleteMany({}),
      ...clean.map((c, i) =>
        db.certification.create({
          data: {
            title: c.title,
            order: i,
            images: { create: c.images.map((url, order) => ({ url, order })) },
          },
        }),
      ),
    ]);
    revalidate();
    return { success: true, data: undefined };
  } catch (e) {
    console.error("[resume/certifications]", e);
    return { success: false, error: "Failed to save certifications" };
  }
}
