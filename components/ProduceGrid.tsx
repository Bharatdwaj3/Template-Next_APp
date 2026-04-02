// components/ProduceGrid.tsx
'use client';
import { ProduceCard, type Produce } from './ProduceCard';

interface ProduceGridProps {
  produce: Produce[];
  onAddToCart: (item: unknown) => void;
}

export const ProduceGrid = ({ produce, onAddToCart }: ProduceGridProps) => {
  if (produce.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-4xl font-black text-primary/20 uppercase mb-2">No Produce Found</p>
        <p className="text-text-muted">Check back later for fresh additions to our marketplace</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {produce.map((item) => (
        <ProduceCard key={item._id} produce={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};