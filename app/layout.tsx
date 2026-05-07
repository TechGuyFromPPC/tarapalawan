'use client';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

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
      <body className="bg-[#010404] opacity-0">{children}</body>
    </html>
  );

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="h-full bg-[#010404] text-slate-900 dark:text-emerald-50 font-sans">
        <div className="flex flex-col min-h-screen">
          
          {!hideGlobalUI && (
            <header className="flex items-center justify-between px-6 py-6 sticky top-0 z-[60] bg-[#010404]/60 backdrop-blur-3xl border-b border-white/5">
              <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter">
                Tara<span className="text-orange-500">!</span>
              </Link>
              <div>
                {user ? (
                  <div className="flex items-center gap-4">
                     <Link href="/profile" className="h-8 w-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xs">👤</Link>
                     <button onClick={handleLogout} className="text-[9px] font-black uppercase text-red-500 opacity-60">Out</button>
                  </div>
                ) : (
                  <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white bg-orange-500 px-6 py-2 rounded-full shadow-lg">Login</Link>
                )}
              </div>
            </header>
          )}

          <main className="flex-1 relative">{children}</main>

          {!hideGlobalUI && (
            <Suspense fallback={null}>
              <MasterNavigation pathname={pathname} />
            </Suspense>
          )}
        </div>
      </body>
    </html>
  );
}

function MasterNavigation({ pathname }: { pathname: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';

  const setFilter = (f: string) => {
    router.push(`/?filter=${f}&t=${Date.now()}`);
  };

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-[100] max-w-sm mx-auto flex flex-col gap-3 p-3 bg-white/95 dark:bg-[#0d2626]/95 backdrop-blur-3xl rounded-[2.5rem] border border-orange-100 dark:border-emerald-900/30 shadow-2xl">
      {pathname === '/' && (
        <div className="flex items-center gap-1 bg-black/5 dark:bg-black/40 p-1 rounded-full">
          {['all', 'top', 'upcoming'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-full text-[8px] font-black uppercase tracking-tight transition-all duration-300 ${
                activeFilter === f 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-slate-400 dark:text-white/20 hover:text-orange-500'
              }`}
            >
              {f === 'all' ? 'All Events' : f === 'top' ? 'Top Picks' : 'Upcoming'}
            </button>
          ))}
        </div>
      )}
      <div className={`flex items-center justify-around ${pathname === '/' ? 'pt-1' : 'py-2'}`}>
        <NavLink href="/" active={pathname === '/'} label="Explore" icon="🏝️" />
        <NavLink href="/messages" active={pathname === '/messages'} label="Pulse" icon="🔥" />
        <NavLink href="/profile" active={pathname === '/profile'} label="Me" icon="🌊" />
      </div>
    </nav>
  );
}

function NavLink({ href, active, label, icon }: { href: string; active: boolean; label: string; icon: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 transition-all active:scale-75">
      <span className={`text-xl ${active ? 'opacity-100 scale-110' : 'opacity-30 grayscale'}`}>{icon}</span>
      <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${active ? 'text-orange-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </Link>
  );
}