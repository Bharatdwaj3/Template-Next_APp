'use client';

import Link from 'next/link';
import { Sprout, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sprout className="w-5 h-5 text-[#e8c84a]" />
          <span className="text-[#1a3d2b] font-black text-xl uppercase italic tracking-tight">Nerthus</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">Something went wrong</p>
        <h2 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight mb-2">Bad Harvest</h2>
        <div className="w-12 h-[2px] mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, #e8c84a, transparent)' }} />
        <p className="text-sm text-[#8a9a8e] leading-relaxed mb-8">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors"
          >
            <RefreshCw size={13} /> Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 bg-white border border-[#d4c9b0] text-[#1a3d2b] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:border-[#1a3d2b]/40 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}