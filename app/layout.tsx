'use client';
import { useTheme } from '@/lib/ThemeContext';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, darkMode } = useTheme();

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* MOBILE HEADER - Only shows on small screens */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 bg-inherit">
        <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-600 uppercase">
          Tara!
        </Link>
        <div className="flex items-center gap-3">
          {!user ? (
            <Link href="/login" className="text-[10px] font-black uppercase bg-blue-600 text-white px-4 py-2 rounded-full">
              Login
            </Link>
          ) : (
            <Link href="/profile" className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden">
               {/* User Avatar */}
            </Link>
          )}
        </div>
      </header>

      {/* DESKTOP SIDEBAR - Hidden on mobile */}
      <aside className="hidden md:flex w-64 flex-col p-6 sticky top-0 h-screen border-r border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-black italic tracking-tighter text-blue-600 uppercase mb-10">Tara!</h1>
        <nav className="flex-1 space-y-4">
          <Link href="/" className="block font-bold hover:text-blue-600 transition-colors">Explore</Link>
          <Link href="/create" className="block font-bold hover:text-blue-600 transition-colors">Host Event</Link>
        </nav>
        {/* Desktop Login Button at bottom */}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}