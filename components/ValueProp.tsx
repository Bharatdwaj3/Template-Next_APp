// components/ValueProp.tsx
import { Sprout, Wheat, Users } from 'lucide-react';

const pillars = [
  {
    icon: <Sprout size={22} className="text-primary" />,
    title: 'Rooted in Soil',
    desc: 'Every product traces back to a named farm and a real farmer you can contact.',
  },
  {
    icon: <Wheat size={22} className="text-primary" />,
    title: 'Honest Yield',
    desc: 'No middlemen. Prices set by farmers. Value returned directly to the land.',
  },
  {
    icon: <Users size={22} className="text-primary" />,
    title: 'Living Network',
    desc: 'A community of growers and families sustaining each other across seasons.',
  },
];

export const ValueProp = () => (
  <section className="bg-bg py-20 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cta mb-3">OUR DOCTRINE</p>
      <h2 className="text-5xl font-black text-text-main tracking-tight mb-4">Our Values</h2>
      <div className="w-12 h-0.5 mx-auto mb-6 bg-linear-to-r from-accent to-transparent" />

      <blockquote className="text-cta italic text-xl max-w-2xl mx-auto mb-12">
        “From the goddess earth, all things are nourished.”
      </blockquote>

      <p className="max-w-xl mx-auto text-text-green text-lg leading-relaxed mb-16">
        We believe in the raw power of the land, unhampered by algorithms. 
        Nerthus connects those who grow with those who eat — directly, honestly, seasonally.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((p, i) => (
          <div
            key={i}
            className="bg-bg-alt border border-border rounded-3xl p-8 text-left card-hover hover:border-primary/30"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              {p.icon}
            </div>
            <h3 className="font-bold text-text-main text-xl mb-3">{p.title}</h3>
            <p className="text-text-muted leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);