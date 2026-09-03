import Link from "next/link";
import { db } from "@shoestore/db";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, services, clients, unread, skills, certs] = await Promise.all([
    db.project.count(),
    db.service.count(),
    db.client.count(),
    db.contactSubmission.count({ where: { isRead: false } }),
    db.skill.count(),
    db.certification.count(),
  ]);

  const stats = [
    { label: "Projects", value: projects, href: "/admin/projects" },
    { label: "Services", value: services, href: "/admin/services" },
    { label: "Clients", value: clients, href: "/admin/clients" },
    { label: "Skills", value: skills, href: "/admin/resume" },
    { label: "Certifications", value: certs, href: "/admin/resume" },
    { label: "Unread messages", value: unread, href: "/admin/contacts" },
  ];

  return (
    <div>
      <PageTitle title="Dashboard" desc="Manage every part of your portfolio." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="glass rounded-2xl p-6 transition hover:-translate-y-1"
          >
            <p className="text-3xl font-black text-[var(--color-text)]">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
