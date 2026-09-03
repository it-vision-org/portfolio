import { db } from "@shoestore/db";
import { getAdminClients } from "@/actions/clientActions";
import { PageTitle } from "@/components/admin/ui";
import ClientsEditor from "@/components/admin/ClientsEditor";

export const dynamic = "force-dynamic";

export default async function ClientsAdminPage() {
  const [clients, logos] = await Promise.all([
    getAdminClients(),
    db.graphicItem.findMany({
      where: { section: "LOGO" },
      orderBy: { order: "asc" },
      select: { imageUrl: true, theme: true },
    }),
  ]);

  const seen = new Set<string>();
  const logoOptions = logos
    .filter((l) => !seen.has(l.imageUrl) && seen.add(l.imageUrl))
    .map((l) => ({ imageUrl: l.imageUrl, theme: l.theme as "BOTH" | "LIGHT" | "DARK" }));

  return (
    <div>
      <PageTitle title="Clients" desc="Trusted customer logos shown in the marquee." />
      <ClientsEditor
        initial={clients.map((c) => ({ name: c.name, logoUrl: c.logoUrl, theme: c.theme }))}
        logoOptions={logoOptions}
      />
    </div>
  );
}
