import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';

interface PageProps {
  children:   ReactNode;
  bg?:        string;
  className?: string;
}

export function Page({ children, bg = 'bg-[#f5f0e8]', className = '' }: PageProps) {
  return (
    <div className={`min-h-screen flex flex-col ${bg} ${className}`}>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}