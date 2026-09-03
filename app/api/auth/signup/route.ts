import { NextRequest, NextResponse } from "next/server";
import { db } from "@shoestore/db";
import { hashPassword } from "@shoestore/utils/hash";
import { registerSchema } from "@shoestore/utils/zod";
import { getAdminUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    // New accounts can only be created by a signed-in admin.
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Sign in as an admin to create accounts." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashed = await hashPassword(password);
    const user = await db.user.create({
      data: { name: name.trim(), email: normalizedEmail, password: hashed },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("[API/AUTH/SIGNUP]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
