import type { ReactNode } from 'react';

interface ContentProps {
  children:   ReactNode;
  bg?:        string;
  className?: string;
}

export function Content({ children, bg = 'bg-[#f5f0e8]', className = '' }: ContentProps) {
  return (
    <div className={`w-full ${bg} ${className}`}>
      {children}
    </div>
  );
}