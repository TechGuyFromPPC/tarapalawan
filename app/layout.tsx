import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../lib/ThemeContext"; 
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tara! - PPC Community Hub",
  description: "Connect and explore Puerto Princesa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <ThemeProvider>
          {/* THE MASTER WRAPPER */}
          <div className="flex flex-col md:flex-row min-h-screen">
            
            {/* 1. MOBILE NAVIGATION (Visible only on small screens) */}
            <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-50">
              <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-600 uppercase">
                Tara!
              </Link>
              <Link href="/login" className="text-[10px] font-black uppercase bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg shadow-blue-500/20">
                Sign In
              </Link>
            </header>

            {/* 2. DESKTOP SIDEBAR (Visible only on medium screens and up) */}
            <aside className="hidden md:flex w-72 flex-col p-8 sticky top-0 h-screen border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Link href="/" className="text-4xl font-black italic tracking-tighter text-blue-600 uppercase mb-12 hover:opacity-80 transition-opacity">
                Tara!
              </Link>
              
              <nav className="flex-1 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <span>🌎</span> Explore
                </Link>
                <Link href="/create" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <span>➕</span> Host Event
                </Link>
              </nav>

              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 mb-1">Status</p>
                  <p className="text-[10px] font-bold opacity-70">PPC Community Beta</p>
                </div>
              </div>
            </aside>

            {/* 3. MAIN CONTENT AREA */}
            <main className="flex-1 w-full overflow-x-hidden">
              <div className="max-w-7xl mx-auto p-4 md:p-10">
                {children}
              </div>
            </main>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}