"use server";

import { redirect } from "next/navigation";
import { db } from "@shoestore/db";
import { comparePassword } from "@shoestore/utils/hash";
import { setAuthCookie, clearAuthCookie, isAdminEmail } from "@/lib/session";

export async function login(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await db.user.findUnique({
    where: { email, isDeleted: false },
    select: { id: true, email: true, password: true },
  });

  if (!user) return { error: "Invalid credentials." };

  const valid = await comparePassword(password, user.password);
  if (!valid) return { error: "Invalid credentials." };

  if (!isAdminEmail(user.email)) {
    return { error: "This account doesn't have backoffice access." };
  }

  await setAuthCookie(user.id, user.email);
  redirect("/admin");
}

export async function logout() {
  await clearAuthCookie();
  redirect("/auth/login");
}
