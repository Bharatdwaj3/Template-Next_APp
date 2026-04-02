// views/Home.tsx
import { Hero } from '@/components/Hero';
import { ServiceCards } from '@/components/ServiceCards';
import { ValueProp } from '@/components/ValueProp';
import { ResponsiveContact } from '@/components/ResponsiveContact';
import { TestimonialsForm } from '@/components/Testimonialsform';
import { Page } from '@/layout/Page';

export default function Home() {
  return (
    <Page>
      <Hero />
      <ServiceCards />
      <ValueProp />
      <ResponsiveContact />
      <TestimonialsForm />
    </Page>
  );
}