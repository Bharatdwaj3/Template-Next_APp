// app/not-found.tsx
import { Sprout, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <Sprout className="w-10 h-10 text-[#8a9a8e]" />
          <XCircle className="w-5 h-5 text-[#c96b6b] absolute -bottom-1 -right-1 bg-bg rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-black text-primary">404</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#8a9a8e]">
            Not Found
          </p>
          <p className="text-sm text-[#5a6a5e] max-w-xs mt-2">
            The page you&apos;re looking for has sprouted away.
          </p>
        </div>
        <Link
          href="/"
          className="mt-2 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] 
                     text-bg bg-primary rounded-sm hover:bg-[#2a523b] 
                     transition-colors duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}