'use client';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeFilter = searchParams.get('filter') || 'all';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true });
      setEvents(data || []);
      if (data) {
        const uniqueCats = Array.from(new Set(data.map((e) => e.category))).filter(Boolean) as string[];
        setCategories(uniqueCats);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) setIsSidebarOpen(true);
  }, [searchParams]);

  const filteredEvents = events.filter((e) => {
    const matchesSearch = `${e.title} ${e.category} ${e.location}`.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'top') return matchesSearch && e.is_featured;
    if (activeFilter === 'upcoming') return matchesSearch && new Date(e.event_date) >= new Date();
    return matchesSearch;
  });

  return (
    <div className="relative min-h-[100dvh] bg-[#010404] text-slate-200 overflow-hidden flex flex-col items-center justify-start px-6 antialiased">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[15%] -left-[20%] w-[150vw] h-[120vh] bg-[linear-gradient(135deg,transparent_40%,#10b981_45%,#f97316_50%,#10b981_55%,transparent_60%)] blur-[100px] animate-aurora opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010404] via-transparent to-black/80" />
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 mt-16 flex flex-col items-center gap-10 text-center w-full max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
          What are you <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-orange-400">seeking?</span>
        </h1>

        <div className="relative group w-full max-w-md mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); setIsSidebarOpen(true); }} className="relative flex items-center bg-black/40 border border-white/10 rounded-full p-1.5 pl-6 backdrop-blur-xl">
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search adventures..."
              className="flex-1 bg-transparent py-3 text-white outline-none text-sm"
            />
            <button type="submit" className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
            </button>
          </form>
        </div>

        <div className="flex overflow-x-auto no-scrollbar w-full gap-2 px-2 pb-80">
          {categories.map((cat) => (
            <button key={cat} onClick={() => {setSearchQuery(cat); setIsSidebarOpen(true);}} className="whitespace-nowrap px-5 py-2.5 rounded-full text-[9px] font-black uppercase border border-white/10 text-emerald-400 bg-white/5">
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SIDEBAR (Z-200 COVERS EVERYTHING) */}
      <aside className={`fixed top-0 left-0 h-full w-full md:w-[400px] bg-[#010404]/98 border-r border-white/10 z-[200] p-8 transition-transform duration-500 backdrop-blur-3xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black italic uppercase text-white tracking-tighter underline decoration-emerald-500 decoration-4">The Pulse</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white/20 text-2xl hover:text-white transition-colors">✕</button>
        </div>
        
        <div className="space-y-4 overflow-y-auto h-[calc(100dvh-100px)] no-scrollbar pb-64">
          {filteredEvents.length > 0 ? filteredEvents.map(event => (
            <button 
              key={event.id} 
              onClick={() => router.push(`/event/${event.id}`)}
              className="w-full text-left group flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              <div className="h-14 w-14 rounded-xl overflow-hidden bg-emerald-900/20 shrink-0 border border-white/5">
                {event.image_url && <img src={event.image_url} className="h-full w-full object-cover" alt="" />}
              </div>
              <div className="flex-1">
                <span className="text-[8px] font-black uppercase text-orange-500">{event.category}</span>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{event.title}</h3>
                <p className="text-[10px] text-white/40">{event.location}</p>
              </div>
            </button>
          )) : (
            <p className="text-center text-white/20 mt-10 italic">No events found...</p>
          )}
        </div>
      </aside>

      {/* Dimmer Overlay */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]" />}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}