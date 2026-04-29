'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // 1. Logic to detect focused pages
  const isChatPage = pathname.startsWith('/chat/');
  const isEventDetailPage = pathname.match(/^\/event\/[^\/]+$/); 
  const hideGlobalUI = isChatPage || isEventDetailPage;

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!mounted) return (
    <html lang="en">
      <body className="bg-white dark:bg-black opacity-0">{children}</body>
    </html>
  );

  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-white dark:bg-black text-slate-900 dark:text-slate-100 font-sans">
        <div className="flex flex-col min-h-screen">
          
          {/* HEADER: Hidden on Chat & Event Detail */}
          {!hideGlobalUI && (
            <header className="flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
              <Link href="/" className="text-xl font-black italic uppercase tracking-tighter">
                Tara<span className="text-blue-600">!</span>
              </Link>
              <div>
                {user ? (
                  <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-full">
                    Out
                  </button>
                ) : (
                  <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                    Login
                  </Link>
                )}
              </div>
            </header>
          )}

          <main className="flex-1">{children}</main>

          {/* BOTTOM NAV: Hidden on Chat & Event Detail */}
          {!hideGlobalUI && (
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-t border-slate-100 dark:border-zinc-900 flex items-center justify-around px-8 z-50">
              <NavLink href="/" active={pathname === '/'} label="Home" icon="🏠" />
              <NavLink href="/messages" active={pathname === '/messages'} label="Pulse" icon="💬" />
              <NavLink href="/profile" active={pathname === '/profile'} label="Me" icon="👤" />
            </nav>
          )}
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, active, label, icon }: { href: string; active: boolean; label: string; icon: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 transition-all active:scale-90">
      <span className={`text-lg ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>{icon}</span>
      <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${active ? 'text-blue-600' : 'text-slate-400'}`}>
        {label}
      </span>
      {active && <div className="h-1 w-1 bg-blue-600 rounded-full mt-0.5" />}
    </Link>
  );
}