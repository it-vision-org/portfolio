import { cache } from "react";
import { db } from "@shoestore/db";
import type { GraphicSection, ProjectCategory, ThemeVisibility } from "@/types";

const DEFAULT_NAVBAR_LOGO = "/ahmedlogo.png";
const DEFAULT_HOME_LOGO = "/ahmedlogo.png";

export const getSiteSettings = cache(async function getSiteSettings() {
  const s = await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return {
    ...s,
    navbarLogoUrl: s.navbarLogoUrl || DEFAULT_NAVBAR_LOGO,
    homeLogoUrl: s.homeLogoUrl || DEFAULT_HOME_LOGO,
    updatedAt: s.updatedAt.toISOString(),
  };
});
export type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;

export async function getResume() {
  const [skillCategories, education, certifications] = await Promise.all([
    db.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: { skills: { orderBy: { order: "asc" } } },
    }),
    db.education.findMany({ orderBy: { order: "asc" } }),
    db.certification.findMany({
      orderBy: { order: "asc" },
      include: { images: { orderBy: { order: "asc" } } },
    }),
  ]);
  return {
    skillCategories: skillCategories.map((c) => ({
      id: c.id,
      name: c.name,
      skills: c.skills.map((s) => ({ id: s.id, name: s.name })),
    })),
    education: education.map((e) => ({
      id: e.id,
      degree: e.degree,
      institution: e.institution,
      period: e.period,
      description: e.description,
    })),
    certifications: certifications.map((c) => ({
      id: c.id,
      title: c.title,
      images: c.images.map((i) => i.url),
    })),
  };
}
export type Resume = Awaited<ReturnType<typeof getResume>>;

export async function getServices() {
  const rows = await db.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return rows.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    icon: s.icon,
    features: s.features,
  }));
}
export type Service = Awaited<ReturnType<typeof getServices>>[number];

export async function getProjects() {
  const rows = await db.project.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });
  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category as ProjectCategory,
    summary: p.summary,
    description: p.description,
    coverImageUrl: p.coverImageUrl,
    tags: p.tags,
    liveUrl: p.liveUrl,
    videoUrl: p.videoUrl,
    githubUrl: p.githubUrl,
    lighthouseImageUrl: p.lighthouseImageUrl,
    images: p.images.map((i) => ({ url: i.url, caption: i.caption })),
  }));
}
export type PublicProject = Awaited<ReturnType<typeof getProjects>>[number];

export async function getGraphicItems() {
  const rows = await db.graphicItem.findMany({ orderBy: { order: "asc" } });
  const bySection: Record<
    GraphicSection,
    { id: string; title: string | null; imageUrl: string; theme: ThemeVisibility }[]
  > = {
    LOGO: [],
    APP_ICON: [],
    COVER: [],
    POST: [],
  };
  for (const r of rows) {
    bySection[r.section as GraphicSection].push({
      id: r.id,
      title: r.title,
      imageUrl: r.imageUrl,
      theme: r.theme as ThemeVisibility,
    });
  }
  return bySection;
}
export type GraphicItems = Awaited<ReturnType<typeof getGraphicItems>>;

export async function getClients() {
  const rows = await db.client.findMany({ orderBy: { order: "asc" } });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
    theme: c.theme as ThemeVisibility,
  }));
}
export type Client = Awaited<ReturnType<typeof getClients>>[number];
