"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/contentSlice";
import { useFollow } from "@/hooks/useFollow";

interface Grocer {
  _id:       string;
  shopName:  string;
  bio:       string;
  location:  { address: string };
  followers: string[];
  following: string[];
  mediaUrl:  string;
}

function GrocerCard({ grocer }: { grocer: Grocer }) {
  const { isFollowing, toggle } = useFollow("grocer", grocer._id);

  return (
    <div className="bg-white border border-[#d4c9b0] rounded-2xl p-5 hover:border-[#1a3d2b]/40 hover:shadow-lg transition-all group">
      <div
        style={{ background: "linear-gradient(90deg, #e8c84a, transparent)" }}
        className="h-0.5 w-0 group-hover:w-full mb-4 transition-all duration-300"
      />
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#d4c9b0] relative">
          {grocer.mediaUrl ? (
            <Image src={grocer.mediaUrl} alt={grocer.shopName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-[#1a3d2b]/10 flex items-center justify-center text-[#1a3d2b] font-black text-xl">
              {grocer.shopName?.[0] ?? 'G'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#e86c2a] mb-0.5">
            Grocer
          </p>
          <h3 className="text-[15px] font-black text-[#1a3d2b] uppercase tracking-tight truncate">
            {grocer.shopName}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={11} className="text-[#8a9a8e]" />
            <span className="text-[11px] text-[#8a9a8e]">{grocer.location?.address ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-[#1a3d2b]" />
          <span className="text-[11px] font-black text-[#1a3d2b]">{grocer.followers.length}</span>
          <span className="text-[10px] text-[#8a9a8e]">followers</span>
        </div>
        <span className="text-[#d4c9b0]">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-black text-[#1a3d2b]">{grocer.following.length}</span>
          <span className="text-[10px] text-[#8a9a8e]">following</span>
        </div>
      </div>

      {grocer.bio && (
        <p className="text-[11px] text-[#4a5a4e] line-clamp-2 mb-4">{grocer.bio}</p>
      )}

      <div className="flex gap-2">
        <Link
          href={`/features/grocer/${grocer._id}`}
          className="flex-1 text-center text-[10px] font-black uppercase tracking-widest py-2 rounded-xl bg-[#1a3d2b] text-[#e8c84a] hover:bg-[#1a3d2b]/90 transition-colors"
        >
          View Profile
        </Link>
        <button
          onClick={toggle}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${
            isFollowing
              ? "bg-[#f5f0e8] text-[#1a3d2b] border-[#1a3d2b]/30"
              : "bg-white text-[#4a5a4e] border-[#d4c9b0] hover:border-[#1a3d2b]/40"
          }`}
        >
          {isFollowing ? "✓" : "+"}
        </button>
      </div>
    </div>
  );
}

export default function GrocersPage() {
  const dispatch    = useAppDispatch();
  const searchQuery = useAppSelector((s) => s.content.searchQuery);

  const [grocers, setGrocers] = useState<Grocer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/grocer")
      .then((res) => res.json())
      .then((data) => setGrocers(data.success ? data.grocers : []))
      .catch(() => setGrocers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = grocers.filter(
    (g) =>
      g.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
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
            Grocers
          </span>
        </div>
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a]/60 mb-2">Our Network</p>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-3">All Grocers</h1>
          <div className="w-12 h-0.5" style={{ background: "linear-gradient(90deg, #e8c84a, transparent)" }} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 bg-white border border-[#d4c9b0] rounded-xl px-4 py-3 mb-10 max-w-md hover:border-[#1a3d2b]/40 transition-colors">
          <input
            type="text"
            placeholder="Search grocers, locations..."
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
            <p className="text-4xl font-black text-[#1a3d2b]/20 uppercase">No Grocers Found</p>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((g) => <GrocerCard key={g._id} grocer={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}