// app/features/buyer/page.tsx

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Loader2, Eye, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/contentSlice";

interface Buyer {
  _id: string;
  userId: {
    _id: string;
    userName: string;
    fullName: string;
    avatar: string;
  };
  following?: string[];
  deliveryAddresses?: Array<{
    label?: string;
    address?: string;
  }>;
  orderHistory?: string[];
  savedProduce?: string[];
}

function BuyerCard({ buyer }: { buyer: Buyer }) {
  const [isHovered, setIsHovered] = useState(false);

  const name = buyer.userId?.fullName || 'Unknown Buyer';
  const userName = buyer.userId?.userName || '';
  const avatar = buyer.userId?.avatar || '';
  const primaryAddress = buyer.deliveryAddresses?.[0]?.address || '';
  const primaryAddressLabel = buyer.deliveryAddresses?.[0]?.label || '';
  const orderCount = buyer.orderHistory?.length || 0;

  return (
    <Link href={`/features/buyer/${buyer.userId?._id || buyer._id}`}>
      <motion.div
        className="bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden hover:border-[#1a3d2b]/40 hover:shadow-xl transition-all duration-300 group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
      >
        <div
          style={{ background: "linear-gradient(90deg, #e8c84a, transparent)" }}
          className="h-0.5 w-0 group-hover:w-full transition-all duration-300"
        />

        <div className="relative h-48 bg-[#f5f0e8] overflow-hidden">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-black text-[#1a3d2b]/20">
                {name[0]}
              </span>
            </div>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-3 right-3"
              >
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                  <Eye size={14} className="text-[#1a3d2b]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#e86c2a] mb-1">
            @{userName}
          </p>

          <h3 className="text-lg font-black text-[#1a3d2b] uppercase tracking-tight mb-2 line-clamp-1">
            {name}
          </h3>

          {primaryAddress && (
            <div className="flex items-center gap-1 mb-3">
              <MapPin size={11} className="text-[#8a9a8e]" />
              <span className="text-[10px] text-[#8a9a8e] line-clamp-1">
                {primaryAddressLabel ? `${primaryAddressLabel}: ` : ''}{primaryAddress}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 mb-4">
            <ShoppingBag size={12} className="text-[#1a3d2b]" />
            <span className="text-[11px] font-black text-[#1a3d2b]">
              {orderCount}
            </span>
            <span className="text-[10px] text-[#8a9a8e]">orders</span>
          </div>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#1a3d2b] via-[#1a3d2b]/95 to-transparent p-5 pt-16"
            >
              {buyer.deliveryAddresses && buyer.deliveryAddresses.length > 0 && (
                <div className="mb-3">
                  {buyer.deliveryAddresses.slice(0, 2).map((addr, i) => (
                    <div key={i} className="flex items-center gap-1 mb-1">
                      <MapPin size={10} className="text-[#e8c84a]" />
                      <span className="text-[9px] text-white/80 line-clamp-1">
                        {addr.label ? `${addr.label}: ` : ''}{addr.address}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <ShoppingBag size={11} className="text-[#e8c84a]" />
                  <span className="text-[9px] text-white/80">
                    {orderCount} orders
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/60 uppercase tracking-wider">
                  View Profile →
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

export default function BuyersPage() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((s) => s.content.searchQuery);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/buyer/profile/")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.buyers) {
          setBuyers(data.buyers);
        } else {
          setBuyers([]);
        }
      })
      .catch(() => setBuyers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = buyers.filter((b) => {
    const name = b.userId?.fullName?.toLowerCase() || '';
    const userName = b.userId?.userName?.toLowerCase() || '';
    const address = b.deliveryAddresses?.[0]?.address?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || userName.includes(query) || address.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#f5f0e8] relative overflow-hidden">

      <div className="bg-[#1a3d2b] py-16 px-6 relative">
        <span
          className="text-[8rem] font-black text-white/10 uppercase select-none whitespace-nowrap absolute right-4 top-1/2 -translate-y-1/2"
          style={{ writingMode: "vertical-rl" }}
        >
          Buyers
        </span>

        <div className="max-w-6xl mx-auto relative">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a] mb-2">
            Our Network
          </p>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight mb-4">
            All Buyers
          </h1>
          <div className="w-12 h-0.5" style={{ background: "linear-gradient(90deg, #e8c84a, transparent)" }} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-center gap-3 bg-white border border-[#d4c9b0] rounded-xl px-4 py-3 mb-10 max-w-md hover:border-[#1a3d2b]/40 transition-colors">
          <input
            type="text"
            placeholder="Search buyers, locations..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="bg-transparent text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none flex-1"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#1a3d2b] animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl font-black text-[#1a3d2b]/20 uppercase">
              {searchQuery ? 'No Buyers Found' : 'No Buyers Yet'}
            </p>
            {!searchQuery && (
              <p className="text-sm text-[#8a9a8e] mt-4">
                Check back later for buyers joining the community.
              </p>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((b) => (
              <BuyerCard key={b._id} buyer={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}