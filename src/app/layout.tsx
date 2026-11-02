import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Home, Library, Settings } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Briefly | AI Content Summarizer",
  description: "Distill long-form content into actionable insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Desktop Header (Hidden on Mobile) */}
        <header className="hidden md:flex justify-between items-center p-6 max-w-7xl mx-auto w-full z-10">
          <div className="text-xl font-bold tracking-tight text-slate-800">
            Briefly.
          </div>
          <nav className="glass-panel px-6 py-2 flex gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Workspace
            </Link>
            <Link
              href="/history"
              className="hover:text-indigo-600 transition-colors"
            >
              Library
            </Link>
            <Link
              href="/settings"
              className="hover:text-indigo-600 transition-colors"
            >
              Settings
            </Link>
          </nav>
        </header>

        {/* Main Content Area (Where your pages will inject) */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 mb-24 md:mb-0 z-10">
          {children}
        </main>

        {/* Mobile Bottom Dock (Hidden on Desktop) */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
          <nav className="glass-panel px-6 py-4 flex justify-between items-center text-slate-600">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-indigo-600"
            >
              <Home size={20} />
              <span className="text-[10px] font-medium">Summarize</span>
            </Link>
            <Link
              href="/history"
              className="flex flex-col items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <Library size={20} />
              <span className="text-[10px] font-medium">Library</span>
            </Link>
            <Link
              href="/settings"
              className="flex flex-col items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <Settings size={20} />
              <span className="text-[10px] font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
