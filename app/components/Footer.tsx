import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-zinc-950 px-6 pt-12 pb-24 border-t border-slate-100 dark:border-zinc-900">
      <div className="max-w-screen-xl mx-auto">
        {/* Brand Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
            Tara! <span className="text-blue-600">Palawan</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
            The heartbeat of the islands. Discover local pulse, anytime.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/create" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase italic">Add Event</Link></li>
              <li><Link href="/about" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase italic">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase italic">Privacy</Link></li>
              <li><Link href="/terms" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase italic">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Business CTA */}
        <div className="p-6 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-500/20">
          <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-2 text-center">Partner with us</p>
          <h4 className="text-xl font-black text-white uppercase italic text-center leading-none mb-4">List your business?</h4>
          <a 
            href="mailto:admin@yourcompany.ph" 
            className="block w-full py-3 bg-white text-blue-600 text-center rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
          >
            Get in touch
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-900 text-center">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">
            © 2026 Tara Media Group .PH
          </p>
        </div>
      </div>
    </footer>
  );
}