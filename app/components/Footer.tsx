import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-4 pb-4">
      <div className="glass mx-auto max-w-6xl rounded-3xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3 sm:col-span-2">
            <div className="flex items-center gap-2">
              <Image src="/itvisionlogo.png" alt="IT Vision" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="text-lg font-bold text-[var(--color-text)]">
                IT<span className="text-gradient">Vision</span>
              </span>
            </div>
            <p className="max-w-sm text-sm text-[var(--color-muted)]">
              We design and build software, web platforms, and embedded systems that turn ideas into reliable products.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]">Navigate</p>
            <div className="flex flex-col gap-2 text-sm text-[var(--color-text)]">
              <Link href="/" className="hover:text-[var(--color-accent)]">Home</Link>
              <Link href="/about" className="hover:text-[var(--color-accent)]">About Us</Link>
              <Link href="/products" className="hover:text-[var(--color-accent)]">Our Products</Link>
              <Link href="/contact" className="hover:text-[var(--color-accent)]">Contact</Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]">Contact</p>
            <div className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-[var(--color-accent)]" /> contact@itvision.dev
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-[var(--color-accent)]" /> +216 51 913 242
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--color-accent)]" /> Tunisia
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/40 pt-6 text-center text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} IT Vision. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
