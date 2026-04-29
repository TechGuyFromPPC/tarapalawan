'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// 1. FORCE DYNAMIC: This prevents the 'prerender error' on Vercel 
// by telling Next.js this page must be rendered at runtime.
export const dynamic = 'force-dynamic';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        // Fallback to empty array if data is null to prevent .map() errors
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse text-blue-600">
          Syncing Pulse...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-32">
      {/* HERO SECTION */}
      <section className="px-6 pt-12 pb-8">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.8] text-slate-900 dark:text-white">
          The <br />
          <span className="text-blue-600">Pulse</span>
        </h1>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-relaxed">
          Puerto Princesa <br /> Real-time Social Hub
        </p>
      </section>

      {/* EVENT FEED */}
      <section className="px-6 space-y-12">
        {events.length > 0 ? (
          events.map((event) => (
            <Link key={event.id} href={`/event/${event.id}`} className="block group">
              <div className="relative">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-slate-100 dark:bg-zinc-900">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] font-black uppercase tracking-widest text-white">
                    {event.category}
                  </span>
                </div>

                {/* Content Overlay/Below */}
                <div className="mt-6 px-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {event.join_count || 0} Pulse
                    </span>
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-zinc-900 rounded-[3rem]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              No events found today.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}