import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "../components/ContactForm";

export default function ContactPage() {
  return (
    <main>
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Contact</p>
          <h1 className="mt-2 text-4xl font-black text-[var(--color-text)] sm:text-5xl">
            Let&apos;s build <span className="text-gradient">something</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-muted)]">
            Have a project, an idea, or just a question? Send us a message and we&apos;ll get back to you.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-gradient-to-br from-[var(--color-blue-dark)] to-[var(--color-accent)] p-2.5">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">Email</p>
                  <p className="text-sm text-[var(--color-muted)]">contact@itvision.dev</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-blue-light)] p-2.5">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">Phone</p>
                  <p className="text-sm text-[var(--color-muted)]">+216 51 913 242</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-gradient-to-br from-[var(--color-blue-bright)] to-[var(--color-blue-dark)] p-2.5">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">Location</p>
                  <p className="text-sm text-[var(--color-muted)]">Tunisia</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </main>
  );
}
