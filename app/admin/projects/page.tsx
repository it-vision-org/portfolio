import Link from "next/link";
import { getAdminProjects } from "@/actions/projectActions";
import { PageTitle } from "@/components/admin/ui";
import ProjectsList from "@/components/admin/ProjectsList";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const projects = await getAdminProjects();
  return (
    <div>
      <PageTitle title="Projects" desc="Full-stack web, mobile and UI/UX projects." />
      <div className="mb-4 flex flex-wrap gap-3">
        <Link
          href="/admin/projects/new"
          className="gradient-flow inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] px-4 py-2.5 text-sm font-bold text-white"
        >
          + New project
        </Link>
        <Link
          href="/admin/projects/graphic"
          className="glass-subtle inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--color-text)]"
        >
          Manage Graphic Design
        </Link>
      </div>
      <ProjectsList initial={projects} />
    </div>
  );
}
