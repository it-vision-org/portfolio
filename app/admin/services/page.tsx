import { getAdminServices } from "@/actions/serviceActions";
import { PageTitle } from "@/components/admin/ui";
import ServicesEditor from "@/components/admin/ServicesEditor";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const services = await getAdminServices();
  return (
    <div>
      <PageTitle title="Services" desc="The service cards shown on the home page." />
      <ServicesEditor
        initial={services.map((s) => ({
          title: s.title,
          description: s.description,
          icon: s.icon,
          features: s.features,
          isPublished: s.isPublished,
        }))}
      />
    </div>
  );
}
