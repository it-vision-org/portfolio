import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/session";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/auth/login?next=/admin");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6 md:py-10">
      <AdminNav userName={user.name} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
