'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login'); // Redirect if not logged in
        return;
      }
      
      setUser(user);

      // Fetch events where the user has joined (Pulse)
      // Assuming you have a 'participants' join table
      const { data: pulses } = await supabase
        .from('participants')
        .select('events (*)')
        .eq('user_id', user.id);

      setJoinedEvents(pulses?.map(p => p.events) || []);
      setLoading(false);
    };

    getProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse text-blue-600">Loading Profile...</div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-32">
      
      {/* 1. PROFILE HEADER */}
      <section className="px-6 pt-16 pb-10 border-b border-slate-100 dark:border-zinc-900">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-3xl font-black italic shadow-xl">
            {user.email?.[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
              My <span className="text-blue-600">Pulse</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
              {user.email}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 border border-red-200 dark:border-red-900/30 px-4 py-2 rounded-full active:scale-95 transition-all"
        >
          Sign Out
        </button>
      </section>

      {/* 2. STATS BAR */}
      <section className="grid grid-cols-2 px-6 py-8 gap-4">
        <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-[2rem]">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Joined</p>
          <p className="text-2xl font-black italic text-blue-600">{joinedEvents.length}</p>
        </div>
        <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-[2rem]">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
          <p className="text-2xl font-black italic text-green-500">Active</p>
        </div>
      </section>

      {/* 3. YOUR "TARA!" LIST */}
      <section className="px-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Your Schedule</h2>
        
        <div className="space-y-4">
          {joinedEvents.length > 0 ? (
            joinedEvents.map((event) => (
              <div 
                key={event.id}
                onClick={() => router.push(`/event/${event.id}`)}
                className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl active:scale-98 transition-all"
              >
                <img src={event.image_url} className="h-16 w-16 rounded-2xl object-cover" alt="" />
                <div className="flex-1">
                  <p className="text-[8px] font-black uppercase text-blue-600">{event.category}</p>
                  <h3 className="text-sm font-black uppercase italic tracking-tighter">{event.title}</h3>
                </div>
                <span className="text-slate-300">→</span>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-zinc-900 rounded-[2.5rem]">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No active Pulses yet.</p>
              <button 
                onClick={() => router.push('/')}
                className="mt-4 text-[10px] font-black uppercase text-blue-600"
              >
                Find something to do →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}