'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      setEvent(data);
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-blue-600 uppercase tracking-widest">Loading Vibe...</div>;
  if (!event) return <div className="p-20 text-center">Event not found.</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-40"> {/* Increased padding for footer safety */}
      
      {/* 1. HERO IMAGE */}
      <div className="relative w-full aspect-[4/3] md:aspect-video bg-zinc-900">
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 h-10 w-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          ←
        </button>
        <img src={event.image_url} className="w-full h-full object-cover" alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent opacity-20" />
      </div>

      {/* 2. FLOATING TITLE BLOCK */}
      <section className="px-6 -mt-10 relative z-10">
        <div className="bg-white dark:bg-zinc-950 p-8 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
              {event.category}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {event.join_count || 0} People In
            </p>
          </div>

          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-[0.85] mb-6">
            {event.title}
          </h1>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-zinc-900">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">When</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">{event.event_date || 'Live Now'}</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Where</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase truncate">{event.location}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DESCRIPTION CONTENT */}
      <section className="px-8 mt-12 pb-20">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">The Experience</h2>
        
        <div className="space-y-6">
          <p className="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-300 first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-blue-600 first-letter:italic">
            {event.description}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-6">
            {['🔥 High Energy', '🎵 Live Music', '🍹 Cocktails', '🌴 Outdoor'].map(vibe => (
              <span key={vibe} className="px-4 py-2 bg-slate-50 dark:bg-zinc-900 rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide border border-slate-100 dark:border-zinc-800">
                {vibe}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FIXED ACTION FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white dark:from-black via-white/95 dark:via-black/95 to-transparent pt-12 z-50">
        <div className="flex gap-3">
          {/* Main Join Button */}
          <Link 
            href={`/chat/${event.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-500/40 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span>Join the Pulse</span>
            <div className="h-2 w-2 bg-white rounded-full animate-ping" />
          </Link>
        </div>
      </div>
    </div>
  );
}