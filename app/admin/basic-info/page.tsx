import { db } from "@shoestore/db";
import { PageTitle } from "@/components/admin/ui";
import BasicInfoForm from "@/components/admin/BasicInfoForm";

export const dynamic = "force-dynamic";

export default async function BasicInfoPage() {
  const s = await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const initial = {
    navbarLogoUrl: s.navbarLogoUrl,
    homeLogoUrl: s.homeLogoUrl,
    heroName: s.heroName,
    heroTitle: s.heroTitle,
    heroTagline: s.heroTagline,
    heroCtaText: s.heroCtaText,
    aboutHeading: s.aboutHeading,
    aboutText: s.aboutText,
    aboutImageUrl: s.aboutImageUrl,
    resumeHeading: s.resumeHeading,
    cvPdfUrl: s.cvPdfUrl,
    contactHeading: s.contactHeading,
    contactText: s.contactText,
    contactEmail: s.contactEmail,
    whatsappNumber: s.whatsappNumber ?? "",
    whatsappLabel: s.whatsappLabel ?? "",
    phoneNumber: s.phoneNumber ?? "",
    phoneLabel: s.phoneLabel ?? "",
    primaryLocation: s.primaryLocation ?? "",
    currentResidency: s.currentResidency ?? "",
    githubUrl: s.githubUrl ?? "",
    githubOrgUrl: s.githubOrgUrl ?? "",
    linkedinUrl: s.linkedinUrl ?? "",
    instagramUrl: s.instagramUrl ?? "",
    youtubeUrl: s.youtubeUrl ?? "",
    footerText: s.footerText,
  };

  return (
    <div>
      <PageTitle title="Basic Info" desc="Logos, hero, about, resume CV, contact details and socials." />
      <BasicInfoForm initial={initial} />
    </div>
  );
}
