'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function PulseInbox() {
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPulses = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return setLoading(false);

      const { data: messages } = await supabase
        .from('messages')
        .select('event_id')
        .eq('user_id', session.user.id);

      const uniqueIds = Array.from(new Set(messages?.map(m => m.event_id)));

      if (uniqueIds.length > 0) {
        const { data: events } = await supabase.from('events').select('*').in('id', uniqueIds);
        setJoinedEvents(events || []);
      }
      setLoading(false);
    };
    fetchPulses();
  }, []);

  if (loading) return <div className="p-10 font-black animate-pulse text-blue-600">SYNCING...</div>;

  return (
    <div className="p-6 bg-white dark:bg-black min-h-screen pb-24">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Pulse</h1>
      <div className="space-y-4">
        {joinedEvents.map(event => (
          <Link key={event.id} href={`/chat/${event.id}`}>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
              <img src={event.image_url} className="h-14 w-14 rounded-2xl object-cover" />
              <div className="flex-1">
                <h3 className="text-sm font-black uppercase italic">{event.title}</h3>
                <span className="text-[8px] font-black uppercase text-green-500">Active</span>
              </div>
            </div>
          </Link>
        ))}
        {joinedEvents.length === 0 && <p className="text-[10px] font-black uppercase text-slate-400 text-center py-20 border-2 border-dashed rounded-[2rem]">No active pulses.</p>}
      </div>
    </div>
  );
}