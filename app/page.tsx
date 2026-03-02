import { Hero } from '@/components/Hero';
import { ServiceCards } from '@/components/Servicecards';
import { ResponsiveContact } from '@/components/Responsivecontact';
import { TestimonialsForm } from '@/components/Testimonialsform';
import { ValueProp } from '@/components/ValueProp';
import { Footer } from '@/components/Footer';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Nerthus — From Soil to Table',
  description: 'A living marketplace where growers share harvest and families find nourishment.',
};

export default function NerthusPage() {
  return (
    <main className="min-h-screen bg-[#f5f0e8]">
      <Navbar />
      <Hero />
      <ServiceCards />
      <ResponsiveContact />
      <TestimonialsForm />
      <ValueProp />
      <Footer />
    </main>
  );
}