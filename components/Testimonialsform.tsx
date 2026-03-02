'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export const TestimonialsForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email });
  };

  return (
    <section className="bg-[#f5f0e8] px-10 py-20 border-t border-[#d4c9b0] relative overflow-hidden">

      <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center overflow-hidden pointer-events-none">
        <span
          className="text-[8rem] font-black text-[#1a3d2b]/4 uppercase select-none whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', letterSpacing: '-0.05em' }}
        >
          Voices
        </span>
      </div>

      <div className="grid grid-cols-12 gap-12 max-w-6xl mx-auto items-center relative z-10">

        
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="col-span-6"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">
            Our Community
          </p>
          <h2 className="text-4xl font-black text-[#1a3d2b] tracking-tight uppercase leading-tight mb-3">
            Testimonially of<br />Farm Faces
          </h2>

         
          <div className="w-12 h-0.5 mb-6" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />

          <p className="text-sm text-[#4a5a4e] leading-relaxed mb-8 max-w-sm">
            Real farmers, real results. From small family plots to large cooperative farms — our growers
            share what sustainable agriculture means to their lives and livelihoods.
          </p>

          <blockquote className="border-l-4 border-[#1a3d2b] pl-5 mb-8 bg-[#1a3d2b]/5 py-4 pr-4 rounded-r-xl">
            <p className="text-sm italic text-[#4a5a4e] leading-relaxed">
              &quot;Joining this network tripled our reach. We went from local market stalls to supplying
              three restaurants in one season.&quot;
            </p>
            <footer className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#1a3d2b]">
              — Rosa Mendes, Organic Grower
            </footer>
          </blockquote>

          <form onSubmit={handleSubscribe} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#d4c9b0] rounded-xl px-4 py-3 text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none focus:border-[#1a3d2b] transition-colors"
            />
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border border-[#d4c9b0] rounded-xl px-4 py-3 text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none focus:border-[#1a3d2b] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#1a3d2b] text-[#e8c84a] text-[11px] font-black uppercase tracking-widest px-6 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
        </motion.div>

        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="col-span-6 relative"
        >
        
          <div className="absolute -top-4 -left-4 w-full h-full bg-[#1a3d2b]/10 rounded-4xl" />

          <div className="relative w-full h-125 rounded-4xl overflow-hidden shadow-xl border border-[#d4c9b0]">
            
            <div className="absolute top-0 left-0 right-0 h-0.75 bg-[#e8c84a] z-10" />
            <Image
              src="https://placehold.co/480x500/1a3d2b/f5f0e8?text=Happy+Farmer"
              alt="Farmer testimonial"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-4 -left-4 bg-[#1a3d2b] rounded-2xl shadow-xl px-5 py-4 border border-[#e8c84a]/20">
            <p className="text-3xl font-black text-[#e8c84a]">2,400+</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#f5f0e8]/50">Active Growers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};