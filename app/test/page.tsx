'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/ThemeContext';
import Link from 'next/link';

export default function LandingPage() {
  const { darkMode, user } = useTheme();
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopPicks() {
      // Fetching the top 5 events based on newest
      const { data } = await supabase
        .from('events')
        .select('*, participants(count)')
        .limit(5)
        .order('created_at', { ascending: false });
      
      setTopEvents(data || []);
      setLoading(false);
    }
    fetchTopPicks();
  }, []);

  const bgClass = darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
      
      {/* --- HERO SECTION --- */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full pb-32">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black tracking-tighter italic text-blue-600">Tara!</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Puerto Princesa City</p>
          </div>
          {user && (
             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black uppercase">
               {user.email?.charAt(0)}
             </div>
          )}
        </header>

        <section className="space-y-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 text-center mb-10">🔥 Top Activities Today</h2>

          {loading ? (
            <div className="h-64 flex items-center justify-center font-black animate-pulse opacity-20 tracking-widest">GATHERING THE SQUAD...</div>
          ) : (
            <div className="flex flex-col gap-12">
              {topEvents.map((event) => (
                <Link href={`/event/${event.id}`} key={event.id} className="group relative h-[400px] md:h-[500px] rounded-[4rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.01]">
                  <img src={event.image_url} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                    <div className="flex gap-3 mb-6">
                      <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {event.category}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {event.participants?.[0]?.count || 0} Joined
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-4 italic">
                      {event.title}
                    </h3>
                    <p className="text-white/60 font-bold flex items-center gap-2 text-sm">
                      📍 {event.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* --- FLOATING BOTTOM NAVIGATION (THE "HOME" BUTTON) --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/20 px-8 py-4 rounded-full shadow-2xl flex items-center gap-8">
          
          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
               🏠
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Home</span>
          </button>

          {/* This button redirects to the Messenger-style Feed */}
          <Link href="/test" className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
               💬
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Feed</span>
          </Link>

          <Link href="/create" className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
               ➕
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Create</span>
          </Link>

        </div>
      </nav>
    </div>
  );
}