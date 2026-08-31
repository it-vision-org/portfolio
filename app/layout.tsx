import "./globals.css";
import type { Metadata } from "next";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  title: "IT Vision — Software, Web & Embedded Development",
  description: "We design and build software, web platforms, and embedded systems that turn ideas into reliable products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-[var(--color-text)] antialiased">
        <div className="bg-blobs" aria-hidden="true">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-blob bg-blob-4" />
        </div>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
