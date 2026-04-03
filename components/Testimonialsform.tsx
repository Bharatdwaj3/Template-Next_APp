// components/Testimonialsform.tsx
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
    <section className="bg-bg py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-12 items-center">
        
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          className="col-span-12 lg:col-span-6"
        >
          <p className="uppercase tracking-[0.5em] text-cta text-xs font-black mb-4">OUR COMMUNITY</p>
          <h2 className="text-4xl font-black text-text-main tracking-tight mb-6">Voices of Farm Faces</h2>

          <p className="text-text-green max-w-md mb-10">
            Real farmers, real results. From small family plots to large cooperative farms.
          </p>

          <blockquote className="border-l-4 border-accent pl-6 italic text-lg text-text-main/90">
            “Joining this network tripled our reach. We went from local market stalls to supplying three restaurants in one season.”
            <footer className="mt-4 text-sm font-medium text-text-muted not-italic">
              — Rosa Mendes, Organic Grower
            </footer>
          </blockquote>

          <form onSubmit={handleSubscribe} className="mt-12 space-y-4 max-w-md">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-white border border-border rounded-2xl focus:outline-none focus:border-accent placeholder:text-text-muted"
            />
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 bg-white border border-border rounded-2xl focus:outline-none focus:border-accent placeholder:text-text-muted"
              />
              <button
                type="submit"
                className="bg-cta hover:bg-cta/90 text-white font-bold uppercase tracking-widest px-8 rounded-2xl transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
        </motion.div>

        
<motion.div
  initial={{ x: 30, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  className="col-span-12 lg:col-span-6 relative"
>
  <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-primary/5 h-150">
    <Image
      src="https://images.unsplash.com/photo-1594489428504-5c0c480a15fa?q=80&w=1000&auto=format&fit=crop"
      alt="Local Organic Grower"
      fill
      className="object-cover"
    />
    <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
  </div>

  <div className="absolute -bottom-8 -left-8 bg-bg-alt rounded-4xl shadow-2xl p-8 border border-border max-w-60">
    <p className="text-4xl font-black text-primary mb-2">2,400+</p>
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cta">Active Growers</p>
    <div className="mt-4 flex -space-x-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-alt bg-primary/10 overflow-hidden relative">
          <Image src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Avatar" fill />
        </div>
      ))}
    </div>
  </div>
</motion.div>
      </div>
    </section>
  );
};
