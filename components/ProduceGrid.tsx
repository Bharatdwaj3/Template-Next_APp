// components/ProduceGrid.tsx
'use client';
import { ProduceCard, type Produce } from './ProduceCard';

interface ProduceGridProps {
  produce: Produce[];
  onAddToCart: (item: any) => void;
}

export const ProduceGrid = ({ produce, onAddToCart }: ProduceGridProps) => {
  if (produce.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-4xl font-black text-[#1a3d2b]/20 uppercase">
          No Produce Found
        </p>
        <p className="text-sm text-[#8a9a8e] mt-4">
          Check back later for fresh additions to our marketplace
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {produce.map((item) => (
        <ProduceCard key={item._id} produce={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};