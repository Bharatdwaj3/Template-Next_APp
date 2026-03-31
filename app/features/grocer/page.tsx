// features/grocer/page.tsx

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Loader2, Eye, Store, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/contentSlice";
import { useFollow } from "@/hooks/useFollow";

interface Grocer {
  _id: string;
  shopName: string;
  bio: string;
  location: { address: string };
  followers: string[];
  following: string[];
  mediaUrl: string;
  userId: {
    _id: string;
    userName: string;
    fullName: string;
    avatar: string;
  };
}

function GrocerCard({ grocer }: { grocer: Grocer }) {
  const { isFollowing, toggle } = useFollow("grocer", grocer._id);
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowingAnimating, setIsFollowingAnimating] = useState(false);

  const userId = grocer.userId ;
  const avatar = userId?.avatar || '';
  const fullName = userId?.fullName || '';
  const userName = userId?.userName || '';
  const shopName = grocer.shopName || '';
  const followerCount = grocer.followers?.length || 0;
  const followingCount = grocer.following?.length || 0;

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowingAnimating(true);
    toggle();
    setTimeout(() => setIsFollowingAnimating(false), 300);
  };

  return (
    <Link href={`/features/grocer/${userId?._id || grocer._id}`}>
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
              alt={shopName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store size={64} className="text-[#1a3d2b]/20" />
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

          
          <div className="absolute top-3 left-3">
            <span className="bg-[#1a3d2b] text-[#e8c84a] text-[9px] font-black px-2.5 py-1 rounded-full">
              GROCER
            </span>
          </div>
        </div>

       
        <div className="p-5">
          
          <h3 className="text-lg font-black text-[#1a3d2b] uppercase tracking-tight mb-2 line-clamp-1">
            {shopName}
          </h3>

          
          <div className="flex items-center gap-1 mb-3">
            <MapPin size={11} className="text-[#8a9a8e]" />
            <span className="text-[10px] text-[#8a9a8e] line-clamp-1">
              {grocer.location?.address ?? '—'}
            </span>
          </div>

          
          <p className="text-[10px] text-[#8a9a8e] mb-3">@{userName}</p>

          
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-[#1a3d2b]" />
              <span className="text-[11px] font-black text-[#1a3d2b]">
                {followerCount}
              </span>
              <span className="text-[10px] text-[#8a9a8e]">followers</span>
            </div>
            <span className="text-[#d4c9b0]">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-[#1a3d2b]">
                {followingCount}
              </span>
              <span className="text-[10px] text-[#8a9a8e]">following</span>
            </div>
          </div>

          
          {grocer.bio && (
            <p className="text-[11px] text-[#4a5a4e] line-clamp-2 mb-4">
              {grocer.bio}
            </p>
          )}

          
          <div className="flex gap-2">
            <button
              onClick={handleFollow}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                isFollowingAnimating
                  ? 'bg-[#2a5a3b] text-[#e8c84a] border-[#2a5a3b]'
                  : isFollowing
                  ? 'bg-[#f5f0e8] text-[#1a3d2b] border-[#1a3d2b]/30'
                  : 'bg-[#1a3d2b] text-[#e8c84a] border-[#1a3d2b] hover:bg-[#2a5a3b]'
              }`}
            >
              {isFollowingAnimating ? (
                <Loader2 size={12} className="animate-spin mx-auto" />
              ) : isFollowing ? (
                '✓ Following'
              ) : (
                '+ Follow'
              )}
            </button>
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
              
              {grocer.bio && (
                <p className="text-[11px] text-white/90 mb-3 line-clamp-2 leading-relaxed">
                  {grocer.bio}
                </p>
              )}

              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Users size={11} className="text-[#e8c84a]" />
                  <span className="text-[9px] text-white/80">
                    {followerCount} followers
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart size={11} className="text-[#e8c84a]" />
                  <span className="text-[9px] text-white/80">
                    {followingCount} following
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

export default function GrocersPage() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((s) => s.content.searchQuery);
  const [grocers, setGrocers] = useState<Grocer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/grocer/profile/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Grocers API response: ", data);
        const grocersList = data.grocers || data.Grocers || [];
        if (data.success && grocersList.length > 0) {
          setGrocers(grocersList);
        } else {
          console.error("No grocers data: ", data);
          setGrocers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching grocers: ", err);
        setGrocers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = grocers.filter((g) => {
    const userId = g.userId ;
    const shopName = g.shopName?.toLowerCase() || '';
    const location = g.location?.address?.toLowerCase() || '';
    const userName = userId?.userName?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return shopName.includes(query) || location.includes(query) || userName.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#f5f0e8] relative overflow-hidden">
     
      <div className="bg-[#1a3d2b] py-16 px-6 relative">
        <span
          className="text-[8rem] font-black text-white/10 uppercase select-none whitespace-nowrap absolute right-4 top-1/2 -translate-y-1/2"
          style={{ writingMode: "vertical-rl" }}
        >
          Grocers
        </span>
        
        <div className="max-w-6xl mx-auto relative">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a] mb-2">
            Our Network
          </p>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight mb-4">
            All Grocers
          </h1>
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
            <p className="text-4xl font-black text-[#1a3d2b]/20 uppercase">
              {searchQuery ? 'No Grocers Found' : 'No Grocers Yet'}
            </p>
            {!searchQuery && (
              <p className="text-sm text-[#8a9a8e] mt-4">
                Check back later for grocers joining the community.
              </p>
            )}
          </div>
        )}
        
     
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((g) => (
              <GrocerCard key={g._id} grocer={g} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}