// features/produce/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Loader2, ShoppingBasket, Leaf, Star, Heart } from 'lucide-react';
import { useCartContext } from '@/hooks/useCartContext';
import { useSavedProduce } from '@/hooks/useSavedProduce';
import { api } from '@/lib/api';

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
  const { addToCart } = useCartContext();
  const [produce, setProduce] = useState<ProduceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Save produce functionality
  const { isSaved, toggle: toggleSave } = useSavedProduce(params.id as string);

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/produce/details/${params.id}`);
        
        if (data.success && data.produce) {
          setProduce(data.produce);
        } else {
          router.push('/features/produce');
        }
      } catch {
        router.push('/features/produce');
      } finally {
        setLoading(false);
      }
    };
    fetchProduce();
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!produce) return;
    setAddingToCart(true);
    addToCart({
      id: produce._id,
      name: produce.name,
      price: produce.price,
      unit: produce.unit,
      img: produce.img,
      grower: produce.farmerId.fullName,
      farmerId: produce.farmerId._id,
      location: '',
      rating: 0
    });
    setTimeout(() => setAddingToCart(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!produce) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <p className="text-text-muted mb-4">Produce not found.</p>
          <Link href="/features/produce" className="flex items-center justify-center gap-2 text-primary hover:underline">
            <ArrowLeft size={16} /> Back to Produce
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/features/produce"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to Produce
        </Link>

        <div className="bg-bg-alt border border-border rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Section */}
            <div className="relative h-80 md:h-96 bg-bg rounded-xl overflow-hidden">
              {produce.img ? (
                <Image
                  src={produce.img}
                  alt={produce.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={80} className="text-text-muted" />
                </div>
              )}
              {produce.isOrganic && (
                <span className="absolute top-4 right-4 flex items-center gap-1 bg-primary text-accent text-[10px] font-black px-3 py-1.5 rounded-full">
                  <Leaf size={12} /> Organic
                </span>
              )}
            </div>

            {/* Details Section */}
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cta">
                    {produce.category}
                  </p>
                  {/* Save Button */}
                  <button
                    onClick={toggleSave}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                      isSaved
                        ? 'bg-red-100 text-red-600 border border-red-200'
                        : 'bg-bg text-text-muted border border-border hover:border-border-hover'
                    }`}
                  >
                    <Heart size={12} className={isSaved ? 'fill-current' : ''} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
                <h1 className="text-3xl font-black text-primary uppercase tracking-tight mb-2">
                  {produce.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-accent text-accent" />
                    <span className="text-sm font-bold text-accent">{produce.rating || 0}</span>
                    <span className="text-[10px] text-text-muted">({produce.totalReviews || 0} reviews)</span>
                  </div>
                  <Link
                    href={`/features/farmer/${produce.farmerId._id}`}
                    className="flex items-center gap-2 text-[11px] text-text-muted hover:text-primary transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {produce.farmerId.avatar ? (
                        <Image src={produce.farmerId.avatar} alt={produce.farmerId.fullName} width={20} height={20} className="rounded-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-black text-primary">{produce.farmerId.fullName?.[0]}</span>
                      )}
                    </div>
                    by {produce.farmerId.fullName}
                  </Link>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-wider text-text-muted mb-2">Description</p>
                <p className="text-sm text-text-green leading-relaxed">{produce.description}</p>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-cta">₹{produce.price}</span>
                  <span className="text-sm text-text-muted">per {produce.unit}</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-border rounded-xl bg-bg-alt">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-primary hover:bg-bg transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-primary">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(produce.stock, quantity + 1))}
                      className="px-3 py-2 text-primary hover:bg-bg transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || produce.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-accent px-6 py-2.5 rounded-xl hover:bg-primary-hover transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                      ? 'bg-primary/10 text-primary' 
                      : produce.stock > 0 
                        ? 'bg-cta/10 text-cta'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {produce.stock > 10 
                      ? 'In Stock' 
                      : produce.stock > 0 
                        ? `Only ${produce.stock} left` 
                        : 'Out of Stock'}
                  </span>
                  <span className="text-text-muted">Free delivery on orders over ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}