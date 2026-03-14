// app/explore/page.tsx
import { Sprout } from 'lucide-react';

// ✅ Option 1: Direct default export (simplest)
export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sprout className="w-6 h-6 text-[#1a3d2b]" />
        <h1 className="text-2xl font-black text-[#1a3d2b]">Explore</h1>
      </div>
      <p className="text-[#5a6a5e]">Discover new content here.</p>
    </div>
  );
}