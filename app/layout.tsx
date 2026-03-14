import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/store/StoreProvider';
import { CartProvider }  from '@/hooks/useCartContext';
import Navbar            from '@/components/Navbar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title:       'Nerthus — From Soil to Table',
  description: 'A living marketplace where growers share harvest and families find nourishment.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <CartProvider>
            <Navbar />
            <div className="h-20" aria-hidden="true" />
            {children}
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}