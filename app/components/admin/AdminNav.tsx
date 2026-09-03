"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCog,
  FileText,
  Briefcase,
  FolderGit2,
  Users,
  Inbox,
  LogOut,
  ExternalLink,
  UserPlus,
} from "lucide-react";
import { logout } from "@/actions/authActions";

const LINKS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/basic-info", label: "Basic Info", Icon: UserCog },
  { href: "/admin/resume", label: "Resume", Icon: FileText },
  { href: "/admin/services", label: "Services", Icon: Briefcase },
  { href: "/admin/projects", label: "Projects", Icon: FolderGit2 },
  { href: "/admin/clients", label: "Clients", Icon: Users },
  { href: "/admin/contacts", label: "Messages", Icon: Inbox },
];

export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="glass h-fit rounded-2xl p-4 md:sticky md:top-6 md:w-60 md:shrink-0">
      <div className="mb-4 px-2">
        <p className="text-sm font-black text-[var(--color-text)]">
          Ahmed<span className="text-gradient"> Zouaghi</span>
        </p>
        <p className="text-xs text-[var(--color-muted)]">{userName}</p>
      </div>

      <nav className="flex flex-wrap gap-1 md:flex-col">
        {LINKS.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface)]/60 hover:text-[var(--color-text)]"
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-[var(--color-border)] pt-3">
        <Link
          href="/admin/new-account"
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
            pathname === "/admin/new-account"
              ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          <UserPlus size={16} /> Create account
        </Link>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          <ExternalLink size={16} /> View site
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--color-muted)] hover:text-red-500"
          >
            <LogOut size={16} /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
