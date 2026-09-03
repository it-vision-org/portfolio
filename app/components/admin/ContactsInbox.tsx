"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, MailOpen, Trash2, ChevronDown } from "lucide-react";
import { markContactRead, deleteContact } from "@/actions/contactActions";
import { Card } from "./ui";

type Msg = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function ContactsInbox({ initial }: { initial: Msg[] }) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [openId, setOpenId] = useState<string | null>(null);

  async function toggleRead(m: Msg) {
    setMsgs((c) => c.map((x) => (x.id === m.id ? { ...x, isRead: !x.isRead } : x)));
    await markContactRead(m.id, !m.isRead);
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const res = await deleteContact(id);
    if (res.success) {
      setMsgs((c) => c.filter((x) => x.id !== id));
      toast.success("Deleted");
    } else toast.error("Failed to delete");
  }

  if (msgs.length === 0) {
    return <Card><p className="text-sm text-[var(--color-muted)]">No messages yet.</p></Card>;
  }

  return (
    <Card>
      <div className="space-y-2">
        {msgs.map((m) => {
          const open = openId === m.id;
          return (
            <div
              key={m.id}
              className={`rounded-xl border p-4 transition ${
                m.isRead ? "border-[var(--color-border)]" : "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpenId(open ? null : m.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-[var(--color-muted)] transition ${open ? "rotate-180" : ""}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[var(--color-text)]">
                      {m.subject || "(no subject)"}
                    </p>
                    <p className="truncate text-xs text-[var(--color-muted)]">
                      {m.name} · {m.email} · {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => toggleRead(m)}
                  aria-label={m.isRead ? "Mark unread" : "Mark read"}
                  className="text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                >
                  {m.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                </button>
                <button
                  onClick={() => remove(m.id)}
                  aria-label="Delete"
                  className="text-[var(--color-muted)] hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {open && (
                <div className="mt-3 border-t border-[var(--color-border)] pt-3">
                  <p className="whitespace-pre-line text-sm text-[var(--color-muted)]">{m.message}</p>
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "")}`}
                    className="mt-3 inline-block text-sm font-bold text-[var(--color-accent)] hover:underline"
                  >
                    Reply by email →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
