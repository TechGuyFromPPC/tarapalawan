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

  // 1. DATE FORMATTER HELPER
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).replace(',', ' —');
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error:', error);
        router.push('/');
      } else {
        setEvent(data);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse text-blue-600">Loading Story...</div>
    </div>
  );

  if (!event) return null;

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-40">
      
      {/* HEADER NAVIGATION */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => router.back()} 
          className="h-12 w-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform shadow-2xl"
        >
          ←
        </button>
      </div>

      {/* HERO IMAGE */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={event.image_url} 
          className="h-full w-full object-cover" 
          alt={event.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent" />
      </div>

      {/* CONTENT BODY */}
      <div className="px-6 -mt-20 relative z-10">
        
        {/* EVENT HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
              {event.category}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {event.location_city} {/* PPC, El Nido, or Coron */}
            </span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
            {event.title}
          </h1>
        </div>

        {/* LOGISTICS GRID */}
        <div className="grid grid-cols-2 gap-4 mb-10 p-6 bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Start Date</p>
            <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
              {formatDate(event.start_date || event.created_at)}
            </p>
          </div>
          
          {event.end_date && (
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">End Date</p>
              <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">{formatDate(event.end_date)}</p>
            </div>
          )}

          <div className="mt-2">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Specific Location</p>
            <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">{event.specific_location}</p>
          </div>

          <div className="mt-2">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Area</p>
            <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">{event.location_city}</p>
          </div>
        </div>

        {/* DESCRIPTION / DETAILS */}
        <div className="max-w-none mb-12">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-blue-600" /> 
            The Experience
          </h3>
          <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line italic">
            {event.details}
          </p>
        </div>

        {/* JOIN CALL TO ACTION */}
        <div className="fixed bottom-10 left-6 right-6 z-50">
          <Link href={`/chat/${event.id}`}>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 transition-all active:scale-95 flex items-center justify-center gap-3">
              Join the Pulse
              <span className="text-xl">↗</span>
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}