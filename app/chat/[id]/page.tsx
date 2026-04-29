'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

export default function ChatRoom() {
  const { id } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [event, setEvent] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setup = async () => {
      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);

      // 2. Get event details
      const { data: ev } = await supabase.from('events').select('title, image_url').eq('id', id).single();
      setEvent(ev);

      // 3. Load message history
      const { data: msgs } = await supabase.from('messages').select('*').eq('event_id', id).order('created_at', { ascending: true });
      setMessages(msgs || []);
    };
    setup();

    // Realtime Listener
    const channel = supabase.channel(`room-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${id}` }, 
      (p) => setMessages((prev) => [...prev, p.new])).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

const send = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newMessage.trim() || !userId) {
    console.log("Cannot send: Message is empty or User is not logged in");
    return;
  }
  
  const { error } = await supabase.from('messages').insert([{ 
    event_id: id, 
    content: newMessage, 
    profile_name: 'Local', // You can change this to a real name later
    user_id: userId // This MUST match your current session ID
  }]);

  if (error) {
    console.error("Supabase Error:", error.message);
  } else {
    setNewMessage('');
  }
};

  // --- LEAVE LOGIC ---
  const handleLeave = async () => {
    if (userId) {
      // Deleting messages is the "trigger" to remove the event from the Pulse Inbox
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('event_id', id)
        .eq('user_id', userId);
      
      if (error) console.error("Error leaving:", error);
    }
    router.push('/messages'); // Take them back to the cleaned-up inbox
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-black overflow-hidden">
      
      {/* 1. HEADER WITH LEAVE BUTTON */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="h-10 w-10 flex items-center justify-center bg-slate-100 dark:bg-zinc-800 rounded-full text-lg font-black transition-active active:scale-90">←</button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl overflow-hidden shadow-md">
              <img src={event?.image_url} className="h-full w-full object-cover" alt="" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase italic tracking-tighter leading-none mb-1 truncate max-w-[120px]">{event?.title}</h2>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Live Pulse</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLeave}
          className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-full active:scale-90 transition-transform"
        >
          Leave
        </button>
      </header>

      {/* 2. CHAT FEED */}
      <div className="flex-1 overflow-y-auto pt-24 pb-32 px-6 space-y-6 no-scrollbar">
        {messages.map((msg, idx) => {
          const isMe = msg.user_id === userId;
          return (
            <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4`}>
              {!isMe && <span className="text-[8px] font-black uppercase text-slate-400 ml-4 mb-1.5 tracking-widest">{msg.profile_name}</span>}
              <div className={`max-w-[85%] px-5 py-3.5 rounded-[1.8rem] text-sm font-medium border shadow-sm ${
                isMe ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* 3. INPUT PILL */}
      <div className="fixed bottom-8 left-6 right-6 z-50">
        <form onSubmit={send} className="flex gap-2 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-2xl">
          <input 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Type a message..." 
            className="flex-1 bg-transparent border-none px-6 text-sm font-medium focus:ring-0 outline-none" 
          />
          <button type="submit" className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all font-bold text-xl">↗</button>
        </form>
      </div>
    </div>
  );
}