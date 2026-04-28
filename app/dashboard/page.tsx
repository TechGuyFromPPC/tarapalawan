'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/ThemeContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useTheme();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  // Only fetch if the user is definitely logged in
  if (user?.id) {
    fetchMyEvents();
  } else {
    setLoading(false); // Stop loading if no user is found
  }
}, [user]);

  async function fetchMyEvents() {
    setLoading(true);
    // In a real scenario, we'd join with an 'analytics' table
    // For now, we'll pull all events you created
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('creator_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setEvents(data);
    setLoading(false);
  }

  async function deleteEvent(id: string) {
    const confirm = window.confirm("Delete this event from the feed?");
    if (!confirm) return;

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) fetchMyEvents();
  }

  if (loading) return <div className="p-20 text-center font-black uppercase italic animate-pulse">Accessing Records...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <header className="flex justify-between items-end mb-12">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Partner Portal</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Your Dashboard</h1>
        </div>
        <Link href="/create" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
          + New Event
        </Link>
      </header>

      {events.length === 0 ? (
        <div className="border-2 border-dashed border-slate-100 dark:border-zinc-900 rounded-[3rem] p-20 text-center">
          <p className="text-slate-400 font-bold uppercase italic text-sm">No events hosted yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="bg-slate-50 dark:bg-zinc-950 rounded-[2.5rem] p-6 border border-slate-100 dark:border-zinc-900 flex flex-col md:flex-row gap-6 items-center">
              {/* Thumbnail */}
              <img src={event.image_url} className="w-24 h-24 rounded-3xl object-cover" />

              {/* Stats & Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black uppercase italic tracking-tight">{event.title}</h3>
                <div className="flex gap-4 mt-3 justify-center md:justify-start">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Views</p>
                    <p className="text-lg font-black">{Math.floor(Math.random() * 200) + 50}</p>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-200 dark:bg-zinc-800 self-center" />
                  <div className="text-center">
                    <p className="text-[8px] font-black text-blue-600 uppercase">RSVPs</p>
                    <p className="text-lg font-black text-blue-600">{Math.floor(Math.random() * 20) + 5}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => deleteEvent(event.id)}
                  className="bg-red-50 dark:bg-red-900/10 text-red-500 px-5 py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  Remove
                </button>
                <Link 
                  href={`/event/${event.id}`}
                  className="bg-slate-200 dark:bg-zinc-800 px-5 py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}