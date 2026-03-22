import Link from 'next/link';
import { Sprout, Lock } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex">

      <div className="hidden lg:flex w-[45%] bg-[#1a3d2b] flex-col justify-between px-16 py-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-[#e8c84a]" />

        <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center overflow-hidden pointer-events-none">
          <span
            className="text-[8rem] font-black text-white/4 uppercase select-none whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', letterSpacing: '-0.05em' }}
          >
            Access
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-[#e8c84a]" />
          <span className="text-white font-black text-xl uppercase italic tracking-tight">Nerthus</span>
        </div>

        <div>
          <div className="w-12 h-0.5 mb-6" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a]/50 mb-4">
            Error 403
          </p>
          <h1 className="text-6xl font-black text-white uppercase leading-none tracking-tight mb-4">
            Gates<br />Are<br />Closed.
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs">
            This field is private. You need permission from the grower to enter this ground.
          </p>
        </div>

        <div className="flex gap-8">
          {[['403', 'Error Code'], ['🔒', 'Access Denied'], ['→', 'Sign In']].map(([num, label]) => (
            <div key={label}>
              <p className="text-xl font-black text-[#e8c84a]">{num}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#1a3d2b]/8 border border-[#1a3d2b]/15 flex items-center justify-center mb-8">
          <Lock className="w-8 h-8 text-[#1a3d2b]/40" />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">
          Unauthorized
        </p>
        <h2 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight mb-2">
          Private Ground
        </h2>
        <div className="w-12 h-0.5 mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, #e8c84a, transparent)' }} />
        <p className="text-sm text-[#8a9a8e] leading-relaxed max-w-sm mx-auto mb-10">
          You don&apos;t have permission to access this area. Sign in with the right account or head back to open fields.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/features/auth/login"
            className="flex items-center justify-center gap-2 bg-[#1a3d2b] text-[#e8c84a] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors"
          >
            Sign In →
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white border border-[#d4c9b0] text-[#1a3d2b] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:border-[#1a3d2b]/40 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}