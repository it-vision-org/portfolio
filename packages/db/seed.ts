import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SKILLS: { category: string; skills: string[] }[] = [
  { category: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS", "Nuxt.js"] },
  { category: "Backend", skills: [".Net", "Python", "Flask", "FastAPI"] },
  { category: "AI/ML", skills: ["LLMs", "ML.Net"] },
  { category: "Mobile Dev", skills: ["Flutter"] },
  { category: "Tools", skills: ["Git", "Docker", "Firebase"] },
  { category: "Design", skills: ["Figma", "Adobe Ai", "Adobe Photoshop"] },
  { category: "Scripting", skills: ["Python", "Bash"] },
  { category: "Data Science", skills: ["Pandas", "NumPy", "Scikit-learn"] },
  { category: "Video Editing", skills: ["Adobe Pr", "Davinci Resolve", "CapCut"] },
];

const EDUCATION = [
  {
    degree: "Master Degree in Artificial Intelligence",
    institution: "Konya Technical University",
    period: "2026",
    description: "Accepted in Türkiye Bursları (Turkish Scholarships program)",
  },
  {
    degree: "Bachelor in Computer Science",
    institution: "Higher Institute of Computer Science and Multimedia of Sfax",
    period: "2022-2025",
    description: "Specialized in Big Data & Data Analysis",
  },
  {
    degree: "Computer Sciences Baccalaureate",
    institution: "Majida Boulila Sfax Secondary school",
    period: "2022",
    description: "Specialized in Computer Sciences",
  },
];

const CERTIFICATIONS = ["Adobe Photoshop", "Adobe Premiere Pro", "Adobe Illustrator"];

const SERVICES = [
  {
    title: "Full-Stack Web Development",
    icon: "Code2",
    description: "End-to-end web platforms built with modern, maintainable stacks.",
    features: ["Responsive design", "API & database design", "Modern UI/UX", "Performance & Lighthouse"],
  },
  {
    title: "Full-Stack Mobile Development",
    icon: "Smartphone",
    description: "Cross-platform mobile apps with a native feel and clean architecture.",
    features: ["Cross-platform (Flutter)", "Offline-first", "Native performance", "Store deployment"],
  },
  {
    title: "UI/UX Design",
    icon: "PenTool",
    description: "Interface and experience design from wireframes to polished prototypes.",
    features: ["Wireframing & flows", "Design systems", "Prototyping in Figma", "Animation-based design"],
  },
  {
    title: "Graphic Design",
    icon: "Palette",
    description: "Visual identity and content — logos, app icons, covers and social posts.",
    features: ["Logo creation", "App icons", "Cover images", "Social media posts"],
  },
];

async function main() {
  // ── Admin user ──────────────────────────────────────────────
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "ahmedzouaghi2003@gmail.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const hashed = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: "Ahmed Zouaghi", email: adminEmail, password: hashed },
  });
  console.log("✔ admin user:", adminEmail);

  // ── Site settings singleton ────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      aboutText:
        "I'm Ahmed Zouaghi, a software developer focused on full-stack web and mobile development, UI/UX and graphic design. I turn ideas into polished, reliable products — from database to pixel.",
      contactText:
        "Ready to bring your ideas to life? Get in touch and let's make something amazing! Whether it's a new project, a collaboration, or just a friendly hello.",
      primaryLocation: "Sfax, Tunisia",
      currentResidency: "Konya, Türkiye",
    },
  });
  console.log("✔ site settings");

  // ── Skills ─────────────────────────────────────────────────
  if ((await prisma.skillCategory.count()) === 0) {
    let i = 0;
    for (const group of SKILLS) {
      await prisma.skillCategory.create({
        data: {
          name: group.category,
          order: i++,
          skills: { create: group.skills.map((name, order) => ({ name, order })) },
        },
      });
    }
    console.log("✔ skills:", SKILLS.length, "categories");
  }

  // ── Education ──────────────────────────────────────────────
  if ((await prisma.education.count()) === 0) {
    await prisma.education.createMany({
      data: EDUCATION.map((e, order) => ({ ...e, order })),
    });
    console.log("✔ education:", EDUCATION.length);
  }

  // ── Certifications ────────────────────────────────────────
  if ((await prisma.certification.count()) === 0) {
    await prisma.certification.createMany({
      data: CERTIFICATIONS.map((title, order) => ({ title, order })),
    });
    console.log("✔ certifications:", CERTIFICATIONS.length);
  }

  // ── Services ──────────────────────────────────────────────
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: SERVICES.map((s, order) => ({ ...s, order })),
    });
    console.log("✔ services:", SERVICES.length);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
