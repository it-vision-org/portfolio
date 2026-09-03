import { getAdminGraphicItems } from "@/actions/projectActions";
import { PageTitle } from "@/components/admin/ui";
import GraphicEditor from "@/components/admin/GraphicEditor";

export const dynamic = "force-dynamic";

export default async function GraphicAdminPage() {
  const items = await getAdminGraphicItems();
  return (
    <div>
      <PageTitle title="Graphic Design" desc="Logos, app icons, cover images and posts — shown as sliders." />
      <GraphicEditor initial={items} />
    </div>
  );
}
