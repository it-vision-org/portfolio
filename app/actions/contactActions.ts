"use server";

import { db } from "@shoestore/db";
import { sendContactFormEmail } from "@shoestore/utils/email";
import { contactSchema } from "@shoestore/utils/zod";

const RECIPIENT = process.env.CONTACT_RECIPIENT || "ahmedzouaghi2003@gmail.com";

export type ContactInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export async function submitContact(
  data: ContactInput,
): Promise<{ success: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const subject = parsed.data.subject?.trim() || null;
  const message = parsed.data.message.trim();

  try {
    await db.contactSubmission.create({ data: { name, email, subject, message } });

    // best-effort: the submission is already stored, so an email hiccup shouldn't fail the request.
    await sendContactFormEmail({
      recipient: RECIPIENT,
      name,
      email,
      subject: subject ?? undefined,
      message,
    }).catch((err) => console.error("[CONTACT] email failed:", err));

    return { success: true };
  } catch (error) {
    console.error("[CONTACT]", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

export async function getContacts(opts?: { unreadOnly?: boolean }) {
  const contacts = await db.contactSubmission.findMany({
    where: opts?.unreadOnly ? { isRead: false } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    subject: c.subject,
    message: c.message,
    isRead: c.isRead,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function markContactRead(id: string, isRead: boolean): Promise<{ success: boolean }> {
  try {
    await db.contactSubmission.update({ where: { id }, data: { isRead } });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function markAllContactsRead(): Promise<{ success: boolean }> {
  try {
    await db.contactSubmission.updateMany({ where: { isRead: false }, data: { isRead: true } });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deleteContact(id: string): Promise<{ success: boolean }> {
  try {
    await db.contactSubmission.delete({ where: { id } });
    return { success: true };
  } catch {
    return { success: false };
  }
}
