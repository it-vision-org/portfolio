import { PageTitle } from "@/components/admin/ui";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <PageTitle title="New project" />
      <ProjectForm />
    </div>
  );
}
