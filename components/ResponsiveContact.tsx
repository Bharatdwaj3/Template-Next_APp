

// components/ResponsiveContact.tsx
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const tabs = ['Farmers', 'Wholesale'];

const features = [
  {
    icon: <MapPin size={18} />,
    title: 'Farming Fields',
    desc: 'Visit certified partner farms across 3 counties. Weekend tours from sunrise.',
  },
  {
    icon: <Phone size={18} />,
    title: 'Direct Hotline',
    desc: 'Speak to a real farmer — no bots, no wait times.',
  },
  {
    icon: <Mail size={18} />,
    title: 'Flexible Delivery',
    desc: 'Delivery networks that adapt to your schedule and volume.',
  },
];

export const ResponsiveContact = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-primary py-20 px-6 text-text-inverse relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">REACH US</p>
          <h2 className="text-4xl font-black tracking-tight">Get In Touch</h2>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-full border transition-all ${
                activeTab === i 
                  ? 'bg-accent text-primary border-accent' 
                  : 'border-text-inverse/30 hover:border-accent text-text-inverse/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
         
          <div className="col-span-12 lg:col-span-5 space-y-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="w-11 h-11 rounded-2xl bg-text-inverse/10 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-1">{f.title}</h4>
                  <p className="text-text-inverse/70 text-[15px] leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

<div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6">
  <div className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
    <Image 
      src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=800&auto=format&fit=crop" 
      alt="Hands in soil" 
      fill 
      className="object-cover opacity-80" 
    />
  </div>
  <div className="flex flex-col gap-6">
    <div className="relative flex-1 rounded-[2.5rem] overflow-hidden border border-white/10">
      <Image 
        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800" 
        alt="Market stand" 
        fill 
        className="object-cover opacity-80" 
      />
    </div>
    <div className="relative h-48 rounded-[2.5rem] overflow-hidden border border-white/10">
      <Image 
        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800" 
        alt="Farm landscape" 
        fill 
        className="object-cover opacity-80" 
      />
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
};