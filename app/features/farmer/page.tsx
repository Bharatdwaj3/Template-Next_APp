// features/farmer/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Loader2, Users, Leaf, Eye, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/contentSlice";
import { useFollow } from "@/hooks/useFollow";

interface Farmer {
  _id: string;
  userId: {
    _id: string;
    userName: string;
    fullName: string;
    avatar: string;
  };
  bio?: string;
  interests?: string[];
  farmType?: string[];
  produce?: string[];
  location?: { address?: string };
  followers?: string[];
  following?: string[];
}

function FarmerCard({ farmer }: { farmer: Farmer }) {
  const { isFollowing, toggle } = useFollow("farmer");
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowingAnimating, setIsFollowingAnimating] = useState(false);

  const name = farmer.userId?.fullName || 'Unknown Farmer';
  const userName = farmer.userId?.userName || '';
  const avatar = farmer.userId?.avatar || '';
  const location = farmer.location?.address || '';
  const specialities = farmer.interests || farmer.farmType || [];
  const followerCount = farmer.followers?.length || 0;
  const isOrganic = specialities.some(s => s.toLowerCase().includes('organic'));

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowingAnimating(true);
    toggle();
    setTimeout(() => setIsFollowingAnimating(false), 300);
  };

  return (
    <Link href={`/features/farmer/${farmer.userId?._id || farmer._id}`}>
      <motion.div
        className="bg-bg-alt border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300 group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
      >
        <div
          style={{ background: "linear-gradient(90deg, var(--color-accent), transparent)" }}
          className="h-0.5 w-0 group-hover:w-full transition-all duration-300"
        />

        <div className="relative h-48 bg-bg overflow-hidden">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-black text-primary/20">
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
                <div className="bg-bg-alt/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                  <Eye size={14} className="text-primary" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isOrganic && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 bg-primary text-accent text-[9px] font-black px-2.5 py-1 rounded-full">
                <Leaf size={10} /> ORGANIC
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-cta mb-1">
            @{userName}
          </p>

          <h3 className="text-lg font-black text-primary uppercase tracking-tight mb-2 line-clamp-1">
            {name}
          </h3>

          {location && (
            <div className="flex items-center gap-1 mb-3">
              <MapPin size={11} className="text-text-muted" />
              <span className="text-[10px] text-text-muted line-clamp-1">
                {location}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {specialities.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-bg text-text-green border border-border"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mb-4">
            <Users size={12} className="text-primary" />
            <span className="text-[11px] font-black text-primary">
              {followerCount}
            </span>
            <span className="text-[10px] text-text-muted">followers</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFollow}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                isFollowingAnimating
                  ? 'bg-primary-hover text-accent border-primary-hover'
                  : isFollowing
                  ? 'bg-bg text-primary border-primary/30'
                  : 'bg-primary text-accent border-primary hover:bg-primary-hover'
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
              className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary via-primary/95 to-transparent p-5 pt-16"
            >
              {farmer.bio && (
                <p className="text-[11px] text-text-inverse/90 mb-3 line-clamp-2 leading-relaxed">
                  {farmer.bio}
                </p>
              )}

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Users size={11} className="text-accent" />
                  <span className="text-[9px] text-text-inverse/80">
                    {followerCount} followers
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Sprout size={11} className="text-accent" />
                  <span className="text-[9px] text-text-inverse/80">
                    {specialities.length} specialities
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[9px] text-text-inverse/60 uppercase tracking-wider">
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

export default function FarmersPage() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((s) => s.content.searchQuery);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/farmer/profile/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Farmers API response:  ", data);
        if (data.success && data.farmers) {
          setFarmers(data.farmers);
        } else {
          console.error("No farmers data:  ", data);
          setFarmers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching farmers:  ", err);
        setFarmers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = farmers.filter((f) => {
    const name = f.userId?.fullName?.toLowerCase() || '';
    const userName = f.userId?.userName?.toLowerCase() || '';
    const location = f.location?.address?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || userName.includes(query) || location.includes(query);
  });

  return (
    <div className="bg-primary py-16 px-6 relative">
      <span
        className="text-[8rem] font-black text-text-inverse/10 uppercase select-none whitespace-nowrap absolute right-4 top-1/2 -translate-y-1/2"
        style={{ writingMode: "vertical-rl" }}
      >
        Farmers
      </span>

      <div className="max-w-6xl mx-auto relative">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-2">
          Our Network
        </p>
        <h1 className="text-5xl font-black text-text-inverse uppercase tracking-tight mb-4">
          All Farmers
        </h1>
        <div className="w-12 h-0.5" style={{ background: "linear-gradient(90deg, var(--color-accent), transparent)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 bg-bg-alt border border-border rounded-xl px-4 py-3 mb-10 max-w-md hover:border-primary/40 transition-colors">
          <input
            type="text"
            placeholder="Search farmers, locations..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="bg-transparent text-sm text-primary placeholder:text-text-muted focus:outline-none flex-1"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl font-black text-primary/20 uppercase">
              {searchQuery ? 'No Farmers Found' : 'No Farmers Yet'}
            </p>
            {!searchQuery && (
              <p className="text-sm text-text-muted mt-4">
                Check back later for farmers joining the community.
              </p>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((f) => (
              <FarmerCard key={f._id} farmer={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}