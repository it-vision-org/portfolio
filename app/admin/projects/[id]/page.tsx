import { notFound } from "next/navigation";
import { getProjectForEdit } from "@/actions/projectActions";
import { PageTitle } from "@/components/admin/ui";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectForEdit(id);
  if (!project) notFound();

  return (
    <div>
      <PageTitle title="Edit project" desc={project.title} />
      <ProjectForm initial={{ ...project, id: project.id }} />
    </div>
  );
}
