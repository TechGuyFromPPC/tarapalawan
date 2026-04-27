'use client';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 1. We wrap the content in a Suspense boundary because useSearchParams 
// requires it in Next.js Client Components.
export default function Home() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black uppercase italic animate-pulse text-slate-400">Syncing...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Determine location from URL (?loc=Coron) or default to 'PPC'
  const selectedLocation = searchParams.get('loc') || 'PPC';

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      let query = supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      // 3. Filter by location (PPC, El Nido, or Coron)
      if (selectedLocation !== 'All') {
        query = query.eq('location', selectedLocation);
      }

      const { data } = await query;
      if (data) setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, [selectedLocation]);

  if (loading) return <div className="p-20 text-center font-black uppercase italic animate-pulse text-blue-600">Finding the vibe...</div>;

  return (
    <div className="pb-24 pt-6 animate-in fade-in duration-700">
      
      {/* FEATURED TOP 3 */}
      <section className="mb-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
          Featured in {selectedLocation}
        </h2>
        
        {events.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto px-6 snap-x snap-mandatory no-scrollbar pb-4">
            {events.slice(0, 3).map((event) => (
              <Link 
                href={`/event/${event.id}`} 
                key={event.id} 
                className="min-w-[85%] snap-center relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-zinc-900 shadow-2xl"
              >
                <img src={event.image_url} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded border border-white/20 mb-2 inline-block">
                    {event.category}
                  </span>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{event.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 bg-slate-50 dark:bg-zinc-900 mx-6 rounded-[2rem] text-center">
            <p className="text-[10px] font-black uppercase text-slate-400">No featured events here yet.</p>
          </div>
        )}
      </section>

      {/* DISCOVER MORE LIST */}
      <section className="px-6 space-y-3">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Discover More</h2>
        
        {events.length > 3 ? (
          events.slice(3).map((event) => (
            <Link 
              href={`/event/${event.id}`} 
              key={event.id} 
              className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-950 p-2 rounded-[1.8rem] border border-slate-100 dark:border-zinc-900 active:scale-[0.97] transition-all shadow-sm"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-800">
                <img src={event.image_url} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-start">
                  <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{event.category}</p>
                  <p className="text-[8px] font-bold text-slate-400 tabular-nums">{event.event_date}</p>
                </div>
                <h4 className="text-base font-black uppercase italic leading-tight truncate mt-0.5">
                  {event.title}
                </h4>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-zinc-800 border border-white dark:border-black" />
                      <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-zinc-700 border border-white dark:border-black" />
                    </div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                      Interested
                    </p>
                  </div>
                  <div className="text-[8px] font-black uppercase text-blue-600 tracking-tighter bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                    Join →
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : events.length === 0 ? null : (
          <p className="text-center text-[10px] font-black uppercase text-slate-300 py-10">That's all for today!</p>
        )}
      </section>

      {/* FAB */}
      <Link 
        href="/create" 
        className="fixed bottom-8 right-6 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-[110] border border-white/10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </Link>
    </div>
  );
}