"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { saveSkills, saveEducation, saveCertifications } from "@/actions/resumeActions";
import { Card, Labeled, SaveButton, AddButton, IconButton, field } from "./ui";
import { SortableList, uid } from "./Sortable";
import MultiImageField from "@/components/upload/MultiImageField";

type SkillCat = { name: string; skills: string[] };
type Edu = { degree: string; institution: string; period: string; description: string };
type Cert = { title: string; images: string[] };
type WithId<T> = T & { uid: string };

const withIds = <T,>(arr: T[]): WithId<T>[] => arr.map((x) => ({ ...x, uid: uid() }));
const strip = <T,>(arr: WithId<T>[]): T[] => arr.map(({ uid: _u, ...rest }) => rest as T);

export default function ResumeEditor({
  skills,
  education,
  certifications,
}: {
  skills: SkillCat[];
  education: Edu[];
  certifications: Cert[];
}) {
  return (
    <>
      <SkillsCard initial={skills} />
      <EducationCard initial={education} />
      <CertificationsCard initial={certifications} />
    </>
  );
}

/* ── Skills ─────────────────────────────────────────────────── */
function SkillsCard({ initial }: { initial: SkillCat[] }) {
  const [rows, setRows] = useState<WithId<SkillCat>[]>(withIds(initial));
  const [busy, setBusy] = useState(false);

  const update = (u: string, patch: Partial<SkillCat>) =>
    setRows((c) => c.map((x) => (x.uid === u ? { ...x, ...patch } : x)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveSkills(strip(rows));
    setBusy(false);
    toast[res.success ? "success" : "error"](res.success ? "Skills saved" : res.error);
  }

  return (
    <Card
      title="Skills Matrix"
      actions={
        <AddButton onClick={() => setRows((c) => [...c, { uid: uid(), name: "", skills: [] }])}>
          Add category
        </AddButton>
      }
    >
      <form onSubmit={save} className="space-y-4">
        <SortableList
          items={rows}
          getId={(r) => r.uid}
          onReorder={setRows}
          className="space-y-4"
          renderItem={(cat) => (
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <div className="flex items-center gap-2">
                <input
                  className={field}
                  placeholder="Category name (e.g. Frontend)"
                  value={cat.name}
                  onChange={(e) => update(cat.uid, { name: e.target.value })}
                />
                <IconButton
                  label="Remove category"
                  danger
                  onClick={() => setRows((c) => c.filter((x) => x.uid !== cat.uid))}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
              <div className="mt-3">
                <Labeled label="Skills (comma separated — order kept as typed)">
                  <input
                    className={field}
                    placeholder="React, TypeScript, Tailwind CSS"
                    value={cat.skills.join(", ")}
                    onChange={(e) =>
                      update(cat.uid, {
                        skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </Labeled>
              </div>
            </div>
          )}
        />
        <SaveButton busy={busy}>Save skills</SaveButton>
      </form>
    </Card>
  );
}

/* ── Education ──────────────────────────────────────────────── */
function EducationCard({ initial }: { initial: Edu[] }) {
  const blank = (): WithId<Edu> => ({
    uid: uid(),
    degree: "",
    institution: "",
    period: "",
    description: "",
  });
  const [rows, setRows] = useState<WithId<Edu>[]>(withIds(initial));
  const [busy, setBusy] = useState(false);

  const update = (u: string, patch: Partial<Edu>) =>
    setRows((c) => c.map((x) => (x.uid === u ? { ...x, ...patch } : x)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveEducation(strip(rows));
    setBusy(false);
    toast[res.success ? "success" : "error"](res.success ? "Education saved" : res.error);
  }

  return (
    <Card title="Education" actions={<AddButton onClick={() => setRows((c) => [...c, blank()])}>Add entry</AddButton>}>
      <form onSubmit={save} className="space-y-4">
        <SortableList
          items={rows}
          getId={(r) => r.uid}
          onReorder={setRows}
          className="space-y-4"
          renderItem={(it) => (
            <div className="space-y-3 rounded-xl border border-[var(--color-border)] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Labeled label="Degree / title">
                    <input className={field} value={it.degree} onChange={(e) => update(it.uid, { degree: e.target.value })} />
                  </Labeled>
                  <Labeled label="Institution">
                    <input className={field} value={it.institution} onChange={(e) => update(it.uid, { institution: e.target.value })} />
                  </Labeled>
                  <Labeled label="Period">
                    <input className={field} value={it.period} onChange={(e) => update(it.uid, { period: e.target.value })} />
                  </Labeled>
                </div>
                <IconButton label="Remove" danger onClick={() => setRows((c) => c.filter((x) => x.uid !== it.uid))}>
                  <Trash2 size={15} />
                </IconButton>
              </div>
              <Labeled label="Description">
                <textarea rows={2} className={field} value={it.description} onChange={(e) => update(it.uid, { description: e.target.value })} />
              </Labeled>
            </div>
          )}
        />
        <SaveButton busy={busy}>Save education</SaveButton>
      </form>
    </Card>
  );
}

/* ── Certifications ────────────────────────────────────────── */
function CertificationsCard({ initial }: { initial: Cert[] }) {
  const [rows, setRows] = useState<WithId<Cert>[]>(withIds(initial));
  const [busy, setBusy] = useState(false);

  const update = (u: string, patch: Partial<Cert>) =>
    setRows((c) => c.map((x) => (x.uid === u ? { ...x, ...patch } : x)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveCertifications(strip(rows));
    setBusy(false);
    toast[res.success ? "success" : "error"](res.success ? "Certifications saved" : res.error);
  }

  return (
    <Card
      title="Certifications"
      actions={
        <AddButton onClick={() => setRows((c) => [...c, { uid: uid(), title: "", images: [] }])}>
          Add certification
        </AddButton>
      }
    >
      <form onSubmit={save} className="space-y-4">
        <SortableList
          items={rows}
          getId={(r) => r.uid}
          onReorder={setRows}
          className="space-y-4"
          renderItem={(it) => (
            <div className="space-y-3 rounded-xl border border-[var(--color-border)] p-4">
              <div className="flex items-center gap-2">
                <input
                  className={field}
                  placeholder="Certification title"
                  value={it.title}
                  onChange={(e) => update(it.uid, { title: e.target.value })}
                />
                <IconButton label="Remove" danger onClick={() => setRows((c) => c.filter((x) => x.uid !== it.uid))}>
                  <Trash2 size={15} />
                </IconButton>
              </div>
              <MultiImageField
                label="Attachments"
                values={it.images}
                onChange={(urls) => update(it.uid, { images: urls })}
              />
            </div>
          )}
        />
        <SaveButton busy={busy}>Save certifications</SaveButton>
      </form>
    </Card>
  );
}
