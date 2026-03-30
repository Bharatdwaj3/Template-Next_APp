// app/features/produce/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Loader2, ShoppingBasket, Leaf, Star } from 'lucide-react';
import { useCartContext } from '@/hooks/useCartContext';

interface ProduceItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  img: string;
  isOrganic: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  farmerId: {
    _id: string;
    userName: string;
    fullName: string;
    avatar: string;
  };
}

export default function ProduceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartContext();
  const [produce, setProduce] = useState<ProduceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduce();
  }, [params.id]);

  const fetchProduce = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/produce/details/${params.id}`);
      const data = await response.json();
      console.log('Produce detail:', data);
      
      if (data.success && data.produce) {
        setProduce(data.produce);
      } else {
        router.push('/features/produce');
      }
    } catch (error) {
      console.error('Error fetching produce:', error);
      router.push('/features/produce');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!produce) return;
    setAddingToCart(true);
    addItem({
      id: produce._id,
      name: produce.name,
      price: produce.price,
      quantity: quantity,
      unit: produce.unit,
      image: produce.img,
      farmerId: produce.farmerId._id,
      farmerName: produce.farmerId.fullName
    });
    setTimeout(() => setAddingToCart(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <Loader2 className="animate-spin text-[#1a3d2b]" size={40} />
      </div>
    );
  }

  if (!produce) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="text-center">
          <p className="text-lg text-[#1a3d2b] mb-4">Produce not found.</p>
          <Link href="/features/produce" className="text-[#e86c2a] hover:underline">
            ← Back to Produce
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-24">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/features/produce"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#4a5a4e] hover:text-[#1a3d2b] mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Produce
        </Link>

        <div className="bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            <div className="relative h-80 md:h-96 bg-[#f5f0e8] rounded-xl overflow-hidden">
              {produce.img ? (
                <Image
                  src={produce.img}
                  alt={produce.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={80} className="text-[#8a9a8e]" />
                </div>
              )}
              {produce.isOrganic && (
                <span className="absolute top-4 right-4 flex items-center gap-1 bg-[#1a3d2b] text-[#e8c84a] text-[10px] font-black px-3 py-1.5 rounded-full">
                  <Leaf size={12} /> Organic
                </span>
              )}
            </div>

            <div>
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#e86c2a] mb-1">
                  {produce.category}
                </p>
                <h1 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight mb-2">
                  {produce.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-[#e86c2a] text-[#e86c2a]" />
                    <span className="text-sm font-bold text-[#e86c2a]">{produce.rating || 0}</span>
                    <span className="text-[10px] text-[#8a9a8e]">({produce.totalReviews || 0} reviews)</span>
                  </div>
                  <Link
                    href={`/features/farmer/${produce.farmerId._id}`}
                    className="flex items-center gap-2 text-[11px] text-[#8a9a8e] hover:text-[#1a3d2b] transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#1a3d2b]/10 flex items-center justify-center">
                      {produce.farmerId.avatar ? (
                        <Image src={produce.farmerId.avatar} alt={produce.farmerId.fullName} width={20} height={20} className="rounded-full" />
                      ) : (
                        <span className="text-[8px] font-black">{produce.farmerId.fullName?.[0]}</span>
                      )}
                    </div>
                    by {produce.farmerId.fullName}
                  </Link>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#8a9a8e] mb-2">Description</p>
                <p className="text-sm text-[#4a5a4e] leading-relaxed">{produce.description}</p>
              </div>

              <div className="border-t border-[#d4c9b0] pt-4 mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-[#e86c2a]">₹{produce.price}</span>
                  <span className="text-sm text-[#8a9a8e]">per {produce.unit}</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-[#d4c9b0] rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-[#1a3d2b] hover:bg-[#f5f0e8] transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-[#1a3d2b]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(produce.stock, quantity + 1))}
                      className="px-3 py-2 text-[#1a3d2b] hover:bg-[#f5f0e8] transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || produce.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1a3d2b] text-[#e8c84a] px-6 py-2.5 rounded-xl hover:bg-[#2a5a3b] transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ShoppingBasket size={16} />
                    )}
                    {produce.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className={`px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                    produce.stock > 10 
                      ? 'bg-green-100 text-green-700' 
                      : produce.stock > 0 
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {produce.stock > 10 
                      ? 'In Stock' 
                      : produce.stock > 0 
                        ? `Only ${produce.stock} left` 
                        : 'Out of Stock'}
                  </span>
                  <span className="text-[#8a9a8e]">Free delivery on orders over ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}