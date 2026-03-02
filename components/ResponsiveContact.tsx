'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const tabs = ['Farmers', 'Wholesale'];

const features = [
  {
    icon: <MapPin className="w-4 h-4 text-[#e86c2a]" />,
    title: 'Farming Fields',
    desc: 'Visit certified partner farms across 3 counties. Tours every weekend from sunrise.',
  },
  {
    icon: <Phone className="w-4 h-4 text-[#e86c2a]" />,
    title: 'Practical Engagement',
    desc: 'Direct grower hotline — speak to a real farmer, not a bot.',
  },
  {
    icon: <Mail className="w-4 h-4 text-[#e86c2a]" />,
    title: 'Flexible Infrastructure',
    desc: 'Modular delivery networks that adapt to your schedule and volume.',
  },
];

export const ResponsiveContact = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-[#1a3d2b] px-10 py-20 relative overflow-hidden">

      {/* Decorative vertical text */}
      <div className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center overflow-hidden pointer-events-none">
        <span
          className="text-[8rem] font-black text-white/3 uppercase select-none whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', letterSpacing: '-0.05em' }}
        >
          Contact
        </span>
      </div>

      <div className="text-center mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a]/60 mb-2">Reach Us</p>
        <h2 className="text-4xl font-black text-[#f5f0e8] tracking-tight uppercase">
          Responsive Contact
        </h2>
        <div className="w-12 h-0.5 mx-auto mt-4" style={{ background: 'linear-gradient(90deg, transparent, #e8c84a, transparent)' }} />
      </div>

      <div className="flex justify-center gap-3 mb-10">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full border transition-all ${
              activeTab === i
                ? 'bg-[#e8c84a] text-[#1a3d2b] border-[#e8c84a]'
                : 'bg-transparent text-[#f5f0e8]/50 border-[#f5f0e8]/20 hover:border-[#e8c84a]/40 hover:text-[#f5f0e8]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto items-stretch relative z-10">

        <div className="col-span-3 flex flex-col gap-4">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-[#f5f0e8]/10">
            <Image src="https://placehold.co/260x200/2d5a3d/f5f0e8?text=Farmer+1" alt="Farmer 1" fill className="object-cover" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#e8c84a]" />
          </div>
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-[#f5f0e8]/10">
            <Image src="https://placehold.co/260x200/3d6b4a/f5f0e8?text=Farmer+2" alt="Farmer 2" fill className="object-cover" />
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="col-span-5 flex flex-col justify-center gap-7 px-4"
        >
          {features.map((f) => (
            <div key={f.title} className="flex gap-3 items-start group">
              <div className="w-9 h-9 rounded-xl bg-[#f5f0e8]/5 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#e86c2a]/20 transition-colors">
                {f.icon}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#e8c84a] mb-1">{f.title}</p>
                <p className="text-[11px] text-[#f5f0e8]/50 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="col-span-4 relative min-h-100 rounded-2xl overflow-hidden border border-[#f5f0e8]/10">
          <Image
            src="https://placehold.co/340x420/2d5a3d/f5f0e8?text=Garden+View"
            alt="Garden"
            fill
            className="object-cover"
          />
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#e8c84a]" />
        </div>
      </div>
    </section>
  );
};