"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/contentSlice";

interface Buyer {
  _id:      string;
  userId:   string;
  mediaUrl: string;
  following: string[];
  savedProduce: string[];
  deliveryAddresses: { label: string; address: string }[];
}

function BuyerCard({ buyer }: { buyer: Buyer }) {
  const address = buyer.deliveryAddresses?.[0]?.address ?? '—';

  return (
    <div className="bg-white border border-[#d4c9b0] rounded-2xl p-5 hover:border-[#1a3d2b]/40 hover:shadow-lg transition-all group">
      <div
        style={{ background: "linear-gradient(90deg, #e8c84a, transparent)" }}
        className="h-0.5 w-0 group-hover:w-full mb-4 transition-all duration-300"
      />
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#d4c9b0] relative">
          {buyer.mediaUrl ? (
            <Image src={buyer.mediaUrl} alt="Buyer" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-[#1a3d2b]/10 flex items-center justify-center text-[#1a3d2b] font-black text-xl">
              B
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#e86c2a] mb-0.5">
            Buyer
          </p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={11} className="text-[#8a9a8e]" />
            <span className="text-[11px] text-[#8a9a8e]">{address}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-[#1a3d2b]" />
          <span className="text-[11px] font-black text-[#1a3d2b]">{buyer.following.length}</span>
          <span className="text-[10px] text-[#8a9a8e]">following</span>
        </div>
        <span className="text-[#d4c9b0]">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-black text-[#1a3d2b]">{buyer.savedProduce.length}</span>
          <span className="text-[10px] text-[#8a9a8e]">saved</span>
        </div>
      </div>

      <Link
        href={`/features/buyer/${buyer.userId}`}
        className="block text-center text-[10px] font-black uppercase tracking-widest py-2 rounded-xl bg-[#1a3d2b] text-[#e8c84a] hover:bg-[#1a3d2b]/90 transition-colors"
      >
        View Profile
      </Link>
    </div>
  );
}

export default function BuyersPage() {
  const dispatch    = useAppDispatch();
  const searchQuery = useAppSelector((s) => s.content.searchQuery);

  const [buyers,  setBuyers]  = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/buyer")
      .then((res) => res.json())
      .then((data) => setBuyers(data.success ? data.buyers : []))
      .catch(() => setBuyers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = buyers.filter((b) =>
    b.deliveryAddresses?.[0]?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-24">
      <div className="bg-[#1a3d2b] px-6 py-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />
        <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="text-[8rem] font-black text-white/4 uppercase select-none whitespace-nowrap"
            style={{ writingMode: "vertical-rl" }}
          >
            Buyers
          </span>
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a]/60 mb-2">Our Network</p>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-3">All Buyers</h1>
          <div className="w-12 h-0.5" style={{ background: "linear-gradient(90deg, #e8c84a, transparent)" }} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 bg-white border border-[#d4c9b0] rounded-xl px-4 py-3 mb-10 max-w-md hover:border-[#1a3d2b]/40 transition-colors">
          <input
            type="text"
            placeholder="Search by location..."
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
            <p className="text-4xl font-black text-[#1a3d2b]/20 uppercase">No Buyers Found</p>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => <BuyerCard key={b._id} buyer={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}