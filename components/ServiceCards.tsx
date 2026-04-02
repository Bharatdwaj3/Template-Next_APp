'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';

const products = [
  {
    name: 'Heirloom Tomatoes',
    desc: 'Farm-fresh heritage varieties grown without pesticides.',
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800',
  },
  {
    name: 'Seasonal Herb Collection',
    desc: 'Aromatic herbs harvested at peak potency each season.',
    rating: 4.6,
    img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800',
  },
  {
    name: 'Premium Root Veggies',
    desc: 'Organically sourced carrots, beets, and tubers.',
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1590779033100-9f60705a2f3b?q=80&w=800',
  },
];

export const ServiceCards = () => (
  <section className="bg-bg py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-16">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cta mb-4">FRESH FROM THE LAND</p>
        <h2 className="text-5xl font-black text-primary tracking-tighter mb-4">Centuries of Connections</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <motion.div key={p.name} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="group">
            <div className="relative aspect-4/3 rounded-4xl overflow-hidden mb-6 shadow-xl shadow-primary/5">
              <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-bg/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span className="text-[10px] font-black text-primary">{p.rating}</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-primary mb-2 uppercase">{p.name}</h3>
            <p className="text-sm text-text-green/70 leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);