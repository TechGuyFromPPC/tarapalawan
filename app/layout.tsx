'use client';
import "./globals.css";
import { ThemeProvider, useTheme } from "../lib/ThemeContext"; 
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-white dark:bg-black text-slate-900 dark:text-white">
        <ThemeProvider>
          <LayoutInner>{children}</LayoutInner>
        </ThemeProvider>
      </body>
    </html>
  );
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { user } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* GLOBAL MINIMALIST HEADER */}
      <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-[100] border-b border-slate-50 dark:border-zinc-900">
        {/* LOGO LEFT */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-black italic text-xs shadow-lg shadow-blue-500/20">T!</div>
          <span className="text-lg font-black italic uppercase tracking-tighter text-blue-600">Tara!</span>
        </Link>

        {/* BREADCRUMB RIGHT */}
        <nav className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <select className="bg-transparent text-blue-600 focus:outline-none appearance-none cursor-pointer px-1">
            <option>PPC</option>
            <option>El Nido</option>
            <option>Coron</option>
          </select>
          <span className="mx-1 opacity-30">/</span>
          <Link href="/events" className="hover:text-blue-600 transition-colors">Joined</Link>
          <span className="mx-1 opacity-30">/</span>
          {!user ? (
            <Link href="/login" className="text-blue-600">Login</Link>
          ) : (
            <button onClick={handleLogout} className="text-red-500">Out</button>
          )}
        </nav>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto">
        {children}
      </main>
    </div>
  );
}