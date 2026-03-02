import Image from 'next/image';
import Link from 'next/link';
import { Sprout } from 'lucide-react';

const footerLinks: Record<string, string[]> = {
  Mission:       ['Overview', 'Locations', 'Sustainability', 'Sitemap'],
  'Farming Log': ['Seasonal', 'Rainfall', 'Soil Tests', 'Archives'],
  'Contact Form': ['Join Network', 'Wholesale', 'Cooperate', 'Media Hub'],
};

const socials = ['fb', 'ig', 'tw', 'yt'];

export const Footer = () => (
  <footer className="bg-[#0f2419] px-10 py-14 relative overflow-hidden">

    <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center overflow-hidden pointer-events-none">
      <span
        className="text-[8rem] font-black text-white/2 uppercase select-none whitespace-nowrap"
        style={{ writingMode: 'vertical-rl', letterSpacing: '-0.05em' }}
      >
        Nerthus
      </span>
    </div>

    <div className="max-w-6xl mx-auto grid grid-cols-12 gap-10 relative z-10">

      <div className="col-span-3">
        <div className="flex items-center gap-2 mb-1">
          <Sprout className="w-5 h-5 text-[#e8c84a]" />
          <span className="text-white font-black text-lg tracking-tight uppercase italic">Nerthus</span>
        </div>
        <div className="w-8 h-0.5 mb-4" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
        <p className="text-[11px] text-white/40 leading-relaxed max-w-45">
          Rooted in tradition, growing toward tomorrow. Connecting farmers and families since ancient soil.
        </p>
        <div className="flex gap-3 mt-6">
          {socials.map((s) => (
            <div
              key={s}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#e8c84a]/20 cursor-pointer transition-colors flex items-center justify-center border border-white/10 hover:border-[#e8c84a]/30"
            >
              <span className="text-[9px] font-black text-white/40 uppercase">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {Object.entries(footerLinks).map(([heading, links]) => (
        <div key={heading} className="col-span-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e8c84a]/40 mb-5">{heading}</p>
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l}>
                <Link
                  href={`/${l.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-[11px] text-white/40 hover:text-[#e8c84a] transition-colors"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="col-span-3">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e8c84a]/40 mb-4">
          Contact Drop
        </p>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#e8c84a]/20">
            <Image
              src="https://placehold.co/32x32/1a3d2b/e8c84a?text=N"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-[11px] font-black text-white">Drop a Line</p>
        </div>
        <p className="text-[10px] text-white/30 leading-relaxed mb-4">
          Subscribe to seasonal harvest updates and farming tips.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter address"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#e8c84a]/30 transition-colors"
          />
          <button
            type="button"
            className="w-8 h-8 bg-[#e8c84a] rounded-lg flex items-center justify-center hover:bg-[#d4b430] transition-colors shrink-0"
          >
            <span className="text-[#1a3d2b] text-xs font-black">→</span>
          </button>
        </div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
      <p className="text-[10px] text-white/20">© 2025 Nerthus. All rights reserved.</p>
      <div className="flex gap-6">
        {['Privacy', 'Terms', 'Cookies'].map((l) => (
          <Link
            key={l}
            href={`/${l.toLowerCase()}`}
            className="text-[10px] text-white/20 hover:text-[#e8c84a]/60 transition-colors"
          >
            {l}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);