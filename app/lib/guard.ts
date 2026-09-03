import { getAdminUser } from "@/lib/session";

/** Throws if the caller isn't a signed-in admin. Use at the top of every mutation. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
