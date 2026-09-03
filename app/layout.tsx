import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Ahmed Zouaghi — Software Developer",
  description:
    "Portfolio of Ahmed Zouaghi — full-stack web & mobile developer, UI/UX and graphic designer.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

// Runs before paint so a saved theme choice is applied with no flash.
// Light is the default — only a stored 'dark' choice overrides it.
const THEME_SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen text-[var(--color-text)] antialiased">
        <div className="bg-blobs" aria-hidden="true">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-blob bg-blob-4" />
        </div>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }}
        />
      </body>
    </html>
  );
}
