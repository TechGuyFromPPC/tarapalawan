'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // New state
  const categories = ['All', 'Music', 'Nature', 'Sports', 'Food', 'Social', 'General'];

  useEffect(() => {
    const fetchEvents = async () => {
      let query = supabase.from('events').select('*').order('created_at', { ascending: false });

      // Apply filter if category is not 'All'
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      const { data } = await query;
      if (data) setEvents(data);
    };

    fetchEvents();
  }, [selectedCategory]); // Re-run whenever selectedCategory changes

  return (
    <div className="pb-24"> 
      <div className="mb-10">
        <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">Explore</h2>
        
        {/* UPDATED PILLS WITH CLICK LOGIC */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full border-2 font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                selectedCategory === cat 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> 
        {selectedCategory === 'All' ? 'Top Picks in PPC' : `${selectedCategory} Events`}
      </p>

      {/* EVENTS GRID (Remains the same) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <Link href={`/event/${event.id}`} key={event.id} className="group relative overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 aspect-[4/5] transition-transform active:scale-95">
              {event.image_url && (
                <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 block">{event.category}</span>
                <h3 className="text-2xl font-black uppercase italic leading-tight">{event.title}</h3>
                <p className="text-white/60 text-[10px] font-bold mt-1 uppercase tracking-tighter">📍 {event.location}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No {selectedCategory} events found yet.</p>
          </div>
        )}
      </div>

      {/* FAB (Remains the same) */}
      <Link href="/create" className="fixed bottom-8 right-8 z-[100] bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.4)] border-4 border-white dark:border-slate-900">
        <span className="text-4xl font-light mb-1">+</span>
      </Link>
    </div>
  );
}