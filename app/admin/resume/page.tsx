import { getResume } from "@/lib/content";
import { PageTitle } from "@/components/admin/ui";
import ResumeEditor from "@/components/admin/ResumeEditor";

export const dynamic = "force-dynamic";

export default async function ResumeAdminPage() {
  const resume = await getResume();
  return (
    <div>
      <PageTitle title="Resume" desc="Skills matrix, education and certifications." />
      <ResumeEditor
        skills={resume.skillCategories.map((c) => ({
          name: c.name,
          skills: c.skills.map((s) => s.name),
        }))}
        education={resume.education.map((e) => ({
          degree: e.degree,
          institution: e.institution,
          period: e.period,
          description: e.description ?? "",
        }))}
        certifications={resume.certifications.map((c) => ({ title: c.title, images: c.images }))}
      />
    </div>
  );
}
