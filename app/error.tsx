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
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sprout className="w-5 h-5 text-[var(--color-primary-accent)]" />
          <span className="text-[var(--color-primary)] font-black text-xl uppercase italic tracking-tight">Nerthus</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--color-cta)] mb-3">Something went wrong</p>
        <h2 className="text-3xl font-black text-[var(--color-primary)] uppercase tracking-tight mb-2">Bad Harvest</h2>
        <div className="w-12 h-0.5 mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary-accent), transparent)' }} />
        <p className="text-sm text-[#8a9a8e] leading-relaxed mb-8">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-accent)] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[var(--color-primary)]/90 transition-colors"
          >
            <RefreshCw size={13} /> Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 bg-white border border-[var(--color-border)] text-[var(--color-primary)] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:border-[var(--color-primary)]/40 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}