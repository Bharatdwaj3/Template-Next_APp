'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sprout, ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <header className="relative min-h-screen w-full flex bg-[#f5f0e8] overflow-hidden">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[5%] w-[55%] h-[65%] bg-[#1a3d2b]/6 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] left-[15%] w-[45%] h-[55%] bg-[#e86c2a]/5 blur-[120px] rounded-full" />
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-32 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <span
          className="text-[9rem] font-black text-[#1a3d2b]/4 uppercase select-none whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', letterSpacing: '-0.05em' }}
        >
          Nerthus
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.0 }}
        className="w-full lg:w-[42%] lg:min-w-100 flex flex-col justify-center px-8 lg:px-24 z-20 bg-[#1a3d2b] relative pt-20"
      >
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-[#e8c84a]" />

        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[10px] font-black uppercase tracking-[0.5rem] text-[#e8c84a]/70 mb-6 flex items-center gap-2"
        >
          <Sprout size={12} className="text-[#e8c84a]" />
          Earth Goddess . Germanic . Anno
        </motion.p>

        <h1 className="text-7xl xl:text-8xl font-black tracking-tighter text-[#f5f0e8] mb-2 leading-none uppercase select-none">
          Nerthus
        </h1>

        <div
          className="w-16 h-0.5 mb-6"
          style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }}
        />

        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e86c2a] mb-4">
          From soil to table - unmediated
        </p>

        <p className="text-base text-[#f5f0e8]/68 leading-relaxed mb-10 font-light max-w-sm">
          A living marketplace where growers share harvest and families find
          nourishment. No algorithms. No middlemen. Just the
          <span className="text-[#e8c84a] font-medium ml-1">earth&apos;s honest yield</span>.
        </p>

        <div className="flex flex-col gap-5">
          <Link
            href="/features/produce"
            className="group flex items-center gap-3 w-fit bg-[#e86c2a] text-white text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-full hover:bg-[#d45e1e] transition-colors shadow-lg"
          >
            Discover Farmers
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/features/auth/register"
            className="group flex items-center gap-3 w-fit text-[11px] font-black uppercase tracking-widest text-[#f5f0e8]/60 hover:text-[#e8c84a] transition-colors border-b border-[#f5f0e8]/20 hover:border-[#e8c84a] pb-1"
          >
            Sell Your Harvest →
          </Link>
        </div>

        <div className="absolute bottom-8 left-8 lg:left-24 flex gap-8">
          {[['2,400+', 'Farmers'], ['18', 'Counties'], ['100%', 'Organic']].map(([num, label]) => (
            <div key={label}>
              <p className="text-xl font-black text-[#e8c84a]">{num}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#f5f0e8]/40">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="hidden lg:flex flex-1 relative items-center justify-center">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.12 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute w-full h-px"
          style={{ background: 'linear-gradient(to right, transparent, #1a3d2b, transparent)' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-24 right-24 bg-white/80 backdrop-blur-sm border border-[#d4c9b0] rounded-2xl px-6 py-4 shadow-xl"
        >
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mb-1">Now in Season</p>
          <p className="text-lg font-black text-[#1a3d2b] uppercase tracking-tight">Spring Harvest</p>
        </motion.div>
        <div className="w-[40%] h-[40%] bg-[#e86c2a]/5 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </header>
  );
};