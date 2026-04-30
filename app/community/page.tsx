'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CommunityList() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      setProfiles(data || []);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Pulses...</div>;

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-20">
      {/* HEADER */}
      <div className="px-6 pt-16 pb-8">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          The <span className="text-blue-600">Community</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">
          {profiles.length} Verified Members in Palawan
        </p>
      </div>

      {/* LIST SECTION */}
      <div className="px-6 space-y-3">
        {profiles.map((profile) => (
          <div 
            key={profile.id} 
            className="flex items-center justify-between p-5 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800"
          >
            <div className="flex items-center gap-4">
              {/* Avatar Icon */}
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black italic shadow-lg">
                {profile.username?.[0].toUpperCase()}
              </div>
              
              {/* Member Info */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {profile.username}
                </h3>
                <p className="text-[10px] font-medium text-slate-400 lowercase">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                Online
              </span>
              <p className="text-[8px] font-bold text-slate-300 mt-1 uppercase">
                {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}