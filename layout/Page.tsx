// layout/Page.tsx
import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';

interface PageProps {
  children: ReactNode;
  className?: string;
}

export function Page({ children, className = '' }: PageProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-bg ${className}`}>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}