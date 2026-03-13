import { Sprout, Wheat, Users } from 'lucide-react';

const pillars = [
  {
    icon:  <Sprout className="w-5 h-5 text-[#e8c84a]" />,
    title: 'Rooted in Soil',
    desc:  'Every product traces back to a named farm and a real farmer you can contact.',
  },
  {
    icon:  <Wheat className="w-5 h-5 text-[#e8c84a]" />,
    title: 'Honest Yield',
    desc:  'No middlemen. Prices set by farmers. Value returned to the land, not logistics.',
  },
  {
    icon:  <Users className="w-5 h-5 text-[#e8c84a]" />,
    title: 'Living Network',
    desc:  'A community of growers and families sustaining each other across seasons.',
  },
];

export const ValueProp = () => (
  <section className="bg-[#1a3d2b] py-24 px-6 relative overflow-hidden">

    <div className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center overflow-hidden pointer-events-none">
      <span
        className="text-[8rem] font-black text-white/[0.03] uppercase select-none whitespace-nowrap"
        style={{ writingMode: 'vertical-rl', letterSpacing: '-0.05em' }}
      >
        Earth
      </span>
    </div>

    <div className="max-w-5xl mx-auto text-center relative z-10">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a]/60 mb-4">
        Our Doctrine
      </p>
      <h2 className="text-5xl font-black mb-3 uppercase tracking-tight text-[#f5f0e8] leading-none">
        Our Narrative
      </h2>
      <div
        className="w-12 h-0.5 mx-auto mb-6"
        style={{ background: 'linear-gradient(90deg, transparent, #e8c84a, transparent)' }}
      />
      <h3 className="text-[#e86c2a] italic text-xl mb-6 font-light">
        &quot;From the goddess earth, all things are nourished.&quot;
      </h3>
      <p className="max-w-xl mx-auto text-base text-[#f5f0e8]/50 leading-relaxed mb-16">
        We believe in the raw power of the land, unhampered by algorithms.
        Nerthus connects those who grow with those who eat — directly, honestly, seasonally.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 bg-[#f5f0e8]/10 rounded-2xl overflow-hidden">
        {pillars.map((p) => (
          <div key={p.title} className="bg-[#1a3d2b] px-8 py-10 text-left hover:bg-[#1a3d2b]/80 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#f5f0e8]/5 flex items-center justify-center mb-5">
              {p.icon}
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#e8c84a] mb-2">{p.title}</p>
            <p className="text-sm text-[#f5f0e8]/50 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);