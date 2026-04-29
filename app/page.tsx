'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Nightlife', 'Adventure', 'Food', 'Culture'];

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      setEvents(data || []);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesCategory = category === 'All' || e.category?.toLowerCase() === category.toLowerCase();
    const matchesSearch = e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const topPicks = events.slice(0, 3);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse text-blue-600">Syncing...</div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-32">
      
      {/* 1. NEW STICKY SEARCH HEADER */}
     {/* 1. STICKY SEARCH HEADER - Fixed clipping issue */}
<div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-2xl px-6 pt-16 pb-6">
  <div className="flex flex-col gap-6">
    <div className="overflow-visible"> {/* Added to prevent italic clipping */}
      <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-[1.1] text-slate-900 dark:text-white">
        The <span className="text-blue-600">Pulse</span>
      </h1>
    </div>
    
    {/* NOTICEABLE SEARCH BAR */}
    <div className="relative group">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-blue-600">
        <span className="text-lg">🔍</span>
      </div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Find your next adventure..."
        className="w-full bg-slate-100 dark:bg-zinc-900 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-800 rounded-3xl py-4 pl-14 pr-6 text-sm font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-600 transition-all shadow-inner outline-none"
      />
    </div>
  </div>
</div>

      {/* 2. TOP PICKS (Hide when searching) */}
      {!searchQuery && (
        <section className="mt-4 mb-12">
          <div className="px-6 mb-4 flex justify-between items-end">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Top Picks</h2>
          </div>
          <div className="flex overflow-x-auto gap-6 px-6 no-scrollbar snap-x">
            {topPicks.map((event) => (
              <Link key={`top-${event.id}`} href={`/event/${event.id}`} className="min-w-[300px] snap-center">
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-zinc-800">
                  <img src={event.image_url} className="h-full w-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                      {event.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. CATEGORY SELECTOR */}
      <section className="px-6 mb-10 overflow-x-auto no-scrollbar flex gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              category === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' 
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 4. MAIN FEED */}
      <section className="px-6 space-y-12">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link key={event.id} href={`/event/${event.id}`} className="block group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-slate-100 dark:bg-zinc-900 shadow-xl">
                <img src={event.image_url} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                <div className="absolute top-8 left-8 px-5 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-[9px] font-black uppercase text-white tracking-widest">
                  {event.category}
                </div>
              </div>
              <div className="mt-6 px-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{event.join_count || 0} Pulse</span>
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none group-hover:text-blue-600 transition-colors">{event.title}</h2>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <span className="text-4xl mb-4">🏜️</span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nothing found for "{searchQuery}"</p>
          </div>
        )}
      </section>
    </div>
  );
}