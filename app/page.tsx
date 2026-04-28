'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  
  // 1. Fixed State: Added both featured and regular event states
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const selectedLocation = searchParams.get('loc') || 'PPC';

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      let query = supabase.from('events').select('*');
      
      if (selectedLocation !== 'All') {
        query = query.eq('location', selectedLocation);
      }

      const { data } = await query.order('created_at', { ascending: false });
      
      if (data) {
        // 2. Logic: Split data into Featured and Regular
        const featured = data.filter(e => e.is_featured === true);
        const regular = data.filter(e => e.is_featured !== true);
        
        setFeaturedEvents(featured);
        setEvents(regular);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [selectedLocation]);

  if (loading) return (
    <div className="p-20 text-center font-black uppercase italic animate-pulse text-blue-600 text-xs tracking-widest">
      Syncing {selectedLocation}...
    </div>
  );

  return (
    <div className="pb-24 pt-6">
      
      {/* FEATURED SLIDER - Showing "Top Picks" */}
      <section className="mb-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-6">
          Top in {selectedLocation}
        </h2>
        
        <div className="flex gap-4 overflow-x-auto px-6 snap-x snap-mandatory no-scrollbar pb-4">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <Link 
                href={`/event/${event.id}`} 
                key={event.id} 
                className="min-w-[85%] snap-center relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-zinc-900 shadow-xl active:scale-95 transition-transform"
              >
                <img src={event.image_url} className="absolute inset-0 w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 pr-6">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {event.title}
                  </h3>
                  <p className="text-blue-400 text-[8px] font-bold uppercase mt-2 tracking-widest">
                    View Details — Join the Pulse
                  </p>
                </div>
              </Link>
            ))
          ) : (
            /* Fallback if no featured events */
            <div className="min-w-full py-10 text-center bg-slate-50 dark:bg-zinc-900/50 rounded-[2rem] text-slate-400 text-[8px] font-black uppercase italic tracking-widest">
              No featured events today
            </div>
          )}
        </div>
      </section>

      {/* DISCOVERY FEED - Showing everything else */}
      <section className="px-6 space-y-3">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
          Discovery
        </h2>
        
        {events.length > 0 ? (
          events.map((event) => (
            <Link 
              href={`/event/${event.id}`} 
              key={event.id} 
              className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-950 p-2 rounded-[1.8rem] border border-slate-100 dark:border-zinc-900 active:scale-95 transition-all"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={event.image_url} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-[8px] font-black text-blue-600 uppercase">{event.category}</p>
                  <p className="text-[8px] font-bold text-slate-400">{event.event_date}</p>
                </div>
                <h4 className="text-base font-black uppercase italic leading-tight truncate">{event.title}</h4>
                <div className="mt-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  Tap to Join
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-10 text-center text-slate-400 text-[8px] font-black uppercase italic">
            Check back later for more!
          </div>
        )}
      </section>
    </div>
  );
}