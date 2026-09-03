import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Code2 as Code,
  GraduationCap,
  FileText,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Github,
  Building2,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import {
  getSiteSettings,
  getResume,
  getServices,
  getProjects,
  getGraphicItems,
  getClients,
} from "@/lib/content";
import { SectionHeading } from "@/components/site/SectionHeading";
import { resolveIcon } from "@/components/site/icon-map";
import CertificationsList from "@/components/site/CertificationsList";
import ProjectsExplorer from "@/components/site/ProjectsExplorer";
import CvButton from "@/components/site/CvButton";
import ClientsMarquee from "@/components/site/ClientsMarquee";
import { ContactForm } from "@/components/site/ContactForm";

// Rendered on demand — content is fully DB-driven and edited from the backoffice,
// so there's no build-time DB round-trip and edits show up immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, resume, services, projects, graphic, clients] = await Promise.all([
    getSiteSettings(),
    getResume(),
    getServices(),
    getProjects(),
    getGraphicItems(),
    getClients(),
  ]);

  const socials = [
    { href: settings.githubUrl, Icon: Github, label: "GitHub — personal" },
    { href: settings.githubOrgUrl, Icon: Building2, label: "GitHub — organization" },
    { href: settings.linkedinUrl, Icon: Linkedin, label: "LinkedIn" },
    { href: settings.instagramUrl, Icon: Instagram, label: "Instagram" },
    { href: settings.youtubeUrl, Icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section id="top" className="overflow-hidden">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 pb-16 pt-4 text-center sm:pt-6">
          <Image
            src={settings.homeLogoUrl}
            alt={settings.heroName}
            width={384}
            height={384}
            className="-my-10 h-60 w-60 rounded-2xl object-contain sm:-my-16 sm:h-96 sm:w-96"
            priority
            unoptimized
          />
          <div className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
            <Sparkles size={14} /> {settings.heroTitle}
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-[var(--color-text)] sm:text-6xl">
            {settings.heroName}
            <span className="text-[var(--color-accent)]">.</span>
          </h1>
          <p className="max-w-xl text-base text-[var(--color-muted)] sm:text-lg">
            {settings.heroTagline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#projects"
              className="gradient-flow glow-pulse inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              {settings.heroCtaText} <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-white/80"
            >
              Get in Touch
            </a>
          </div>
          {socials.length > 0 && (
            <div className="mt-2 flex items-center gap-3">
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
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────── */}
      <section id="about" className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading eyebrow="Who I am" title={settings.aboutHeading || "About Me"} />
        <div
          className={`glass grid items-center gap-8 rounded-3xl p-8 ${
            settings.aboutImageUrl ? "md:grid-cols-[0.8fr_1.2fr]" : ""
          }`}
        >
          {settings.aboutImageUrl && (
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.aboutImageUrl}
                alt={settings.heroName}
                className="aspect-square w-full object-cover"
              />
            </div>
          )}
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-muted)]">
            {settings.aboutText || "Add your about text from the backoffice."}
          </p>
        </div>
      </section>

      {/* ── Resume ───────────────────────────────────────────── */}
      <section id="resume" className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="Background" title={settings.resumeHeading || "My Resume"} />

        {/* Skills matrix */}
        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex items-center gap-2">
            <Code size={20} className="text-[var(--color-accent)]" />
            <h3 className="text-xl font-black text-[var(--color-text)]">Skills Matrix</h3>
          </div>
          {resume.skillCategories.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">No skills added yet.</p>
          ) : (
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {resume.skillCategories.map((cat) => (
                <div key={cat.id}>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                    {cat.name}
                  </p>
                  <div className="mt-1 h-0.5 w-8 rounded bg-[var(--color-accent)]" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.skills.map((s) => (
                      <span
                        key={s.id}
                        className="glass-subtle rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--color-text)]"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education + Certifications */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-3xl p-8">
            <div className="mb-5 flex items-center gap-2">
              <GraduationCap size={20} className="text-[var(--color-accent)]" />
              <h3 className="text-xl font-black text-[var(--color-text)]">Education</h3>
            </div>
            <div className="space-y-6">
              {resume.education.map((e) => (
                <div key={e.id} className="border-l-2 border-[var(--color-accent)] pl-4">
                  <h4 className="font-bold text-[var(--color-text)]">{e.degree}</h4>
                  <p className="text-sm text-[var(--color-muted)]">{e.institution}</p>
                  <span className="mt-1 inline-block rounded bg-[var(--color-accent)]/15 px-2 py-0.5 text-xs font-bold text-[var(--color-accent)]">
                    {e.period}
                  </span>
                  {e.description && (
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{e.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-8">
            <div className="mb-5 flex items-center gap-2">
              <FileText size={20} className="text-[var(--color-accent)]" />
              <h3 className="text-xl font-black text-[var(--color-text)]">Certifications</h3>
            </div>
            <CertificationsList items={resume.certifications} />
          </div>
        </div>

        {settings.cvPdfUrl && (
          <div className="mt-6 glass flex flex-col items-center gap-4 rounded-3xl p-10 text-center">
            <FileText size={36} className="text-[var(--color-accent)]" />
            <h3 className="text-2xl font-black text-[var(--color-text)]">Curriculum Vitae</h3>
            <CvButton url={settings.cvPdfUrl} />
          </div>
        )}
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      {services.length > 0 && (
        <section id="services" className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading
            eyebrow="What I do"
            title="Services Tailored for You"
            subtitle="From database to pixel — here's how I can help."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const Icon = resolveIcon(s.icon);
              return (
                <div key={s.id} className="glass flex flex-col rounded-2xl p-6 transition hover:-translate-y-1">
                  <div className="mb-4 inline-flex w-fit rounded-xl bg-gradient-to-br from-[var(--color-blue-dark)] via-[var(--color-accent)] to-[var(--color-blue-light)] p-3">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[var(--color-text)]">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--color-muted)]">{s.description}</p>
                  {s.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-text)]">
                          <ArrowRight size={14} className="mt-1 shrink-0 text-[var(--color-accent)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Projects ─────────────────────────────────────────── */}
      <section id="projects" className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Portfolio"
          title="Featured Projects"
          subtitle="Full-stack web & mobile builds, UI/UX case studies and graphic design work."
        />
        <ProjectsExplorer projects={projects} graphic={graphic} />
      </section>

      {/* ── Clients ──────────────────────────────────────────── */}
      <section id="clients" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Trusted by"
            title="Trusted by Customers"
            subtitle="Proud to have collaborated with these companies and individuals."
          />
        </div>
        {clients.length > 0 ? (
          <ClientsMarquee clients={clients} />
        ) : (
          <p className="text-center text-sm text-[var(--color-muted)]">Client logos coming soon.</p>
        )}
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-3xl font-black text-[var(--color-text)] sm:text-4xl">
              {settings.contactHeading}
              <span className="text-[var(--color-accent)]">.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-[var(--color-muted)]">{settings.contactText}</p>

            <div className="mt-8 space-y-5">
              <ContactRow Icon={Mail} label="Email" value={settings.contactEmail} href={`mailto:${settings.contactEmail}`} />
              {settings.whatsappNumber && (
                <ContactRow
                  Icon={MessageCircle}
                  label={settings.whatsappLabel || "WhatsApp"}
                  value={settings.whatsappNumber}
                />
              )}
              {settings.phoneNumber && (
                <ContactRow Icon={Phone} label={settings.phoneLabel || "Phone"} value={settings.phoneNumber} />
              )}
              {settings.primaryLocation && (
                <ContactRow Icon={MapPin} label="Primary Location" value={settings.primaryLocation} />
              )}
              {settings.currentResidency && (
                <ContactRow Icon={MapPin} label="Current Residency" value={settings.currentResidency} />
              )}
            </div>

            {socials.length > 0 && (
              <div className="mt-8 flex items-center gap-3">
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
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}

function ContactRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <div className="glass-subtle rounded-xl p-2.5">
        <Icon size={18} className="text-[var(--color-accent)]" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">{label}</p>
        <p className="font-semibold text-[var(--color-text)]">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block transition hover:opacity-80">
      {inner}
    </a>
  ) : (
    inner
  );
}
