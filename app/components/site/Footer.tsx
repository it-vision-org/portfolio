import Image from "next/image";
import { Github, Building2, Linkedin, Instagram, Youtube } from "lucide-react";
import type { SiteSettings } from "@/lib/content";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.githubUrl, Icon: Github, label: "GitHub — personal" },
    { href: settings.githubOrgUrl, Icon: Building2, label: "GitHub — organization" },
    { href: settings.linkedinUrl, Icon: Linkedin, label: "LinkedIn" },
    { href: settings.instagramUrl, Icon: Instagram, label: "Instagram" },
    { href: settings.youtubeUrl, Icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="px-4 pb-4">
      <div className="glass mx-auto max-w-6xl rounded-3xl px-6 py-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2">
            <Image
              src={settings.navbarLogoUrl}
              alt="Ahmed Zouaghi"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
              unoptimized
            />
            <span className="text-base font-black text-[var(--color-text)]">
              Ahmed<span className="text-gradient"> Zouaghi</span>
            </span>
          </div>

          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label} title={label}
                  className="glass-subtle inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-muted)] transition hover:text-[var(--color-accent)]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}

          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} Ahmed Zouaghi. {settings.footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}
