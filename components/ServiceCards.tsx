'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';

const products = [
  {
    name: 'Heirloom Tomatoes & Greens',
    desc: 'Farm-fresh heritage varieties grown without pesticides.',
    rating: 4.8,
    img: 'https://placehold.co/280x180/1a3d2b/e8c84a?text=Tomatoes',
  },
  {
    name: 'Seasonal Herb Collection',
    desc: 'Aromatic herbs harvested at peak potency each season.',
    rating: 4.6,
    img: 'https://placehold.co/280x180/1a3d2b/e8c84a?text=Herbs',
  },
  {
    name: 'Premium Root Vegetables',
    desc: 'Organically sourced carrots, beets, and tubers.',
    rating: 4.9,
    img: 'https://placehold.co/280x180/1a3d2b/e8c84a?text=Roots',
  },
];

export const ServiceCards = () => (
  <section className="bg-[#f5f0e8] px-10 py-20 relative overflow-hidden">

    <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center overflow-hidden pointer-events-none">
      <span
        className="text-[8rem] font-black text-[#1a3d2b]/4 uppercase select-none whitespace-nowrap"
        style={{ writingMode: 'vertical-rl', letterSpacing: '-0.05em' }}
      >
        Harvest
      </span>
    </div>


    <div className="text-center mb-14">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-2">What we offer</p>
      <h2 className="text-4xl font-black text-[#1a3d2b] tracking-tight uppercase">
        Centuries of Connections
      </h2>
      <div className="w-12 h-0.5 mx-auto mt-4" style={{ background: 'linear-gradient(90deg, transparent, #1a3d2b, transparent)' }} />
    </div>

    <div className="grid grid-cols-12 gap-8 max-w-6xl mx-auto items-start relative z-10">

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="col-span-4"
      >
        <div className="relative w-full h-105 rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="https://placehold.co/380x420/1a3d2b/f5f0e8?text=Farm+Worker"
            alt="Farm worker"
            fill
            className="object-cover"
          />
          <div className="absolute top-0 left-0 right-0 h-0.75 bg-[#e8c84a]" />
        </div>
      </motion.div>

      <div className="col-span-8 space-y-8">
        <div>
          <h3 className="text-2xl font-black text-[#1a3d2b] tracking-tight uppercase mb-1">
            Service Cards
          </h3>
          <div className="w-8 h-0.5 mb-3" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e86c2a] mb-3">
            Fresh & Home
          </p>
          <p className="text-sm text-[#4a5a4e] leading-relaxed max-w-lg">
            From seed to table, our network of growers delivers premium, certified-organic produce
            directly to your community — year-round reliability, unmatched freshness.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#1a3d2b]/30 transition-all group"
            >
              <div className="relative w-full h-28">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-black text-[#1a3d2b] leading-tight mb-1 uppercase tracking-tight">
                  {p.name}
                </p>
                <p className="text-[10px] text-[#8a9a8e] leading-snug mb-2">{p.desc}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#e86c2a] text-[#e86c2a]" />
                  <span className="text-[10px] font-black text-[#e86c2a]">{p.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);