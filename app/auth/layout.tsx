import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 block text-center text-xl font-black tracking-tight text-[var(--color-text)]"
        >
          Ahmed<span className="text-gradient"> Zouaghi</span>
        </Link>
        <div className="glass-strong rounded-3xl p-8">{children}</div>
      </div>
    </main>
  );
}
