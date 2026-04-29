'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Footer from './components/Footer';
export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State Management
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const selectedLocation = searchParams.get('loc') || 'PPC';
  
  const locations = [
    { id: 'PPC', label: 'Puerto Princesa' },
    { id: 'El Nido', label: 'El Nido' },
    { id: 'Coron', label: 'Coron' }
  ];

  const categories = ['All', 'Music', 'Food', 'Nature', 'Social', 'Sports'];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      let query = supabase.from('events').select('*');
      
      if (selectedLocation !== 'All') {
        query = query.eq('location', selectedLocation);
      }

      const { data } = await query.order('created_at', { ascending: false });
      
      if (data) {
        // Featured stays global to the location
        setFeaturedEvents(data.filter(e => e.is_featured === true));
        
        // Discovery filters by Category
        let regular = data.filter(e => e.is_featured !== true);
        if (activeCategory !== 'All') {
          regular = regular.filter(e => e.category === activeCategory);
        }
        setEvents(regular);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [selectedLocation, activeCategory]);

  const handleLocationChange = (locId: string) => {
    router.push(`?loc=${locId}`);
  };

  if (loading) return (
    <div className="p-20 text-center font-black uppercase italic animate-pulse text-blue-600 text-xs tracking-[0.3em]">
      Syncing {selectedLocation}...
    </div>
  );

  return (
    <div className="pb-24 pt-4 bg-white dark:bg-black min-h-screen">
      
      {/* 1. PREMIUM LOCATION PICKER */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Explore Island</h1>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                {selectedLocation}
              </span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-3xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center border border-slate-100 dark:border-zinc-800 shadow-sm">
             <span className="text-xl">🌴</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleLocationChange(loc.id)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedLocation === loc.id 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xl scale-105' 
                  : 'bg-slate-50 dark:bg-zinc-950 text-slate-400 border border-slate-100 dark:border-zinc-900'
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. FEATURED SLIDER */}
      <section className="mb-12">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-6">
          Top Picks
        </h2>
        <div className="flex gap-4 overflow-x-auto px-6 snap-x snap-mandatory no-scrollbar pb-4 custom-scroll-dampening">
          {featuredEvents.map((event) => (
            <Link 
              href={`/event/${event.id}`} 
              key={event.id} 
              className="min-w-[88%] snap-center relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-zinc-900 shadow-2xl active:scale-95 transition-transform"
            >
              <img src={event.image_url} className="absolute inset-0 w-full h-full object-cover opacity-70" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 pr-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                    {event.join_count || 0} interested
                  </p>
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">
                  {event.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY FILTERS */}
      <div className="flex gap-2 overflow-x-auto px-6 no-scrollbar mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. DISCOVERY LIST */}
      <section className="px-6 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Discovery</h2>
        {events.length > 0 ? (
          events.map((event) => (
            <Link 
              href={`/event/${event.id}`} 
              key={event.id} 
              className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-950 p-3 rounded-[2.2rem] border border-slate-100 dark:border-zinc-900 active:scale-[0.98] transition-all"
            >
              <div className="w-20 h-20 rounded-3xl overflow-hidden flex-shrink-0 shadow-sm">
                <img src={event.image_url} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mb-1">{event.category}</p>
                <h4 className="text-lg font-black uppercase italic leading-none truncate mb-2">{event.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{event.join_count || 0} Pulse</span>
                  <span className="text-[8px] font-black text-slate-900 dark:text-white uppercase italic">Join +</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-10 text-center text-slate-400 text-[10px] font-black uppercase italic tracking-widest">
            More events coming soon
          </div>
        )}
      </section>
        <Footer />
    </div>
  );
}