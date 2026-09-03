"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateSiteSettings, type SiteSettingsInput } from "@/actions/siteSettingsActions";
import { Card, Labeled, SaveButton, field } from "./ui";
import ImageField from "@/components/upload/ImageField";
import PdfField from "@/components/upload/PdfField";

type Settings = Record<string, string | null>;
type SaveResult = { success: true } | { success: false; error?: string };

function SettingsSection({
  title,
  onSave,
  children,
}: {
  title: string;
  onSave: () => Promise<SaveResult>;
  children: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Card title={title}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const res = await onSave();
          setBusy(false);
          toast[res.success ? "success" : "error"](res.success ? "Saved" : res.error ?? "Failed");
        }}
      >
        <div className="space-y-4">{children}</div>
        <div className="mt-5">
          <SaveButton busy={busy}>Save {title.toLowerCase()}</SaveButton>
        </div>
      </form>
    </Card>
  );
}

export default function BasicInfoForm({ initial }: { initial: Settings }) {
  const [s, setS] = useState<Settings>(initial);

  const set = (k: string, v: string | null) => setS((p) => ({ ...p, [k]: v }));
  const bind = (k: string) => ({
    value: (s[k] as string) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value),
    className: field,
  });

  const save = (keys: string[]) => async (): Promise<SaveResult> => {
    const payload: SiteSettingsInput = {};
    for (const k of keys) (payload as Record<string, string | null>)[k] = s[k] ?? "";
    return updateSiteSettings(payload);
  };

  return (
    <div>
      <SettingsSection title="Logos" onSave={save(["navbarLogoUrl", "homeLogoUrl"])}>
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageField
            label="Navbar logo"
            endpoint="logo"
            value={(s.navbarLogoUrl as string) || null}
            onChange={(u) => set("navbarLogoUrl", u)}
            hint="Small square logo shown in the header. Falls back to /ahmedlogo.png."
          />
          <ImageField
            label="Home / hero logo"
            endpoint="logo"
            value={(s.homeLogoUrl as string) || null}
            onChange={(u) => set("homeLogoUrl", u)}
            hint="Large logo at the top of the page. Falls back to /ahmedlogo.png."
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Hero"
        onSave={save(["heroName", "heroTitle", "heroCtaText", "heroTagline"])}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Name">
            <input {...bind("heroName")} />
          </Labeled>
          <Labeled label="Title / badge">
            <input {...bind("heroTitle")} />
          </Labeled>
          <Labeled label="CTA button text">
            <input {...bind("heroCtaText")} />
          </Labeled>
        </div>
        <Labeled label="Tagline">
          <textarea rows={2} {...bind("heroTagline")} />
        </Labeled>
      </SettingsSection>

      <SettingsSection
        title="About"
        onSave={save(["aboutHeading", "aboutText", "aboutImageUrl"])}
      >
        <Labeled label="Heading">
          <input {...bind("aboutHeading")} />
        </Labeled>
        <Labeled label="About text">
          <textarea rows={5} {...bind("aboutText")} />
        </Labeled>
        <ImageField
          label="About image"
          value={(s.aboutImageUrl as string) || null}
          onChange={(u) => set("aboutImageUrl", u)}
          aspect="aspect-square"
        />
      </SettingsSection>

      <SettingsSection title="Resume" onSave={save(["resumeHeading", "cvPdfUrl"])}>
        <Labeled label="Resume heading">
          <input {...bind("resumeHeading")} />
        </Labeled>
        <PdfField value={(s.cvPdfUrl as string) || null} onChange={(u) => set("cvPdfUrl", u)} />
      </SettingsSection>

      <SettingsSection
        title="Contact & Socials"
        onSave={save([
          "contactHeading",
          "contactEmail",
          "contactText",
          "whatsappNumber",
          "whatsappLabel",
          "phoneNumber",
          "phoneLabel",
          "primaryLocation",
          "currentResidency",
          "githubUrl",
          "githubOrgUrl",
          "linkedinUrl",
          "instagramUrl",
          "youtubeUrl",
          "footerText",
        ])}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Contact heading">
            <input {...bind("contactHeading")} />
          </Labeled>
          <Labeled label="Contact email (shown on site)">
            <input {...bind("contactEmail")} />
          </Labeled>
        </div>
        <Labeled label="Contact intro text">
          <textarea rows={3} {...bind("contactText")} />
        </Labeled>
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="WhatsApp number">
            <input {...bind("whatsappNumber")} />
          </Labeled>
          <Labeled label="WhatsApp label">
            <input {...bind("whatsappLabel")} />
          </Labeled>
          <Labeled label="Phone number">
            <input {...bind("phoneNumber")} />
          </Labeled>
          <Labeled label="Phone label">
            <input {...bind("phoneLabel")} />
          </Labeled>
          <Labeled label="Primary location">
            <input {...bind("primaryLocation")} />
          </Labeled>
          <Labeled label="Current residency">
            <input {...bind("currentResidency")} />
          </Labeled>
          <Labeled label="GitHub — personal profile">
            <input {...bind("githubUrl")} placeholder="https://github.com/username" />
          </Labeled>
          <Labeled label="GitHub — organization">
            <input {...bind("githubOrgUrl")} placeholder="https://github.com/org" />
          </Labeled>
          <Labeled label="LinkedIn URL">
            <input {...bind("linkedinUrl")} />
          </Labeled>
          <Labeled label="Instagram URL">
            <input {...bind("instagramUrl")} />
          </Labeled>
          <Labeled label="YouTube URL">
            <input {...bind("youtubeUrl")} />
          </Labeled>
        </div>
        <Labeled label="Footer tagline">
          <input {...bind("footerText")} />
        </Labeled>
      </SettingsSection>
    </div>
  );
}
