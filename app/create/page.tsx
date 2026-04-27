'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../lib/ThemeContext';

export default function CreateEvent() {
  const { user } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('PPC');
  const [category, setCategory] = useState('General');
  const [date, setDate] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please login first");
    setLoading(true);

    const { error } = await supabase.from('events').insert([
      { 
        title, 
        location, 
        category, 
        event_date: date,
        creator_id: user.id 
      }
    ]);

    if (error) {
      alert(error.message);
    } else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-10 pb-24">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Host Event</h1>

      <form onSubmit={handleCreate} className="space-y-8">
        
        {/* 1. LOCATION SELECTOR (The "Breadcrumb" style buttons) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Where in Palawan?</label>
          <div className="grid grid-cols-3 gap-2">
            {['PPC', 'El Nido', 'Coron'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(loc)}
                className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${
                  location === loc ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 dark:bg-zinc-900'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* 2. TITLE INPUT */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Event Name</label>
          <input 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sunset Yoga"
            className="w-full bg-slate-50 dark:bg-zinc-950 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        {/* 3. CATEGORY & DATE (Side by Side) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 rounded-2xl px-4 py-4 font-bold text-xs appearance-none outline-none"
            >
              <option>Music</option>
              <option>Sports</option>
              <option>Food</option>
              <option>Nature</option>
              <option>Social</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 rounded-2xl px-4 py-4 font-bold text-xs outline-none"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase italic tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Push to Feed →'}
        </button>
      </form>
    </div>
  );
}