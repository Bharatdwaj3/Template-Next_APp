import { Sprout } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Sprout className="w-6 h-6 text-[#1a3d2b] animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#8a9a8e]">
          Loading
        </p>
      </div>
    </div>
  );
}