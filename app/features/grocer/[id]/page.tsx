// features/grocer/[id]/page.tsx
'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Phone, ArrowLeft, Package, Loader2, LogOut,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser } from '@/store/avatarSlice';
import { clearFollowing } from '@/store/followSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import { clearSavedProduce, markProduceVisited } from '@/store/contentSlice';
import { useFollow } from '@/hooks/useFollow';

interface GrocerProfile {
  _id: string;
  bio: string;
  shopName: string;
  location: { address?: string; coordinates?: number[] };
  savedProduce: string[];
  likedProduce: string[];
  followers: string[];
  following: string[];
  mediaUrl: string;
  createdAt: string;
  cloudinaryId: string;
  updatedAt: string;
  userId: {
    _id: string;
    userName: string;
    fullName: string;
    email: string;
    avatar: string;
    accountType: string;
  };
}

export default function GrocerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.avatar.user);
  const { id } = use(params);
  const [grocer, setGrocer] = useState<GrocerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const { isFollowing, toggle } = useFollow(id);
  const isOwner = currentUser?.id === id;

  const localFollowing = useAppSelector((state) => state.follow.following);  // ✅ ADD THIS

// Calculate display counts
const displayFollowerCount = isOwner ? localFollowing.length : (grocer?.followers?.length ?? 0);
const displayFollowingCount = isOwner ? localFollowing.length : (grocer?.following?.length ?? 0);


  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/grocer/profile/${id}`);
        const data = await res.json();
        if (res.status === 401) { router.push('/features/auth/login'); return; }
        if (res.status === 403) { router.push('/unauthorized'); return; }
        if (!data.success) { setGrocer(null); return; }
        setGrocer(data.grocer);
      } catch (err) {
        console.error(err);
        setGrocer(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      dispatch(clearUser());
      dispatch(clearFollowing());
      dispatch(clearSavedProduce());
      router.push('/features/auth/login');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <Loader2 className="animate-spin text-[#1a3d2b]" size={40} />
    </div>
  );

  if (!grocer) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="text-center">
        <p className="text-[#8a9a8e] mb-4">Grocer not found.</p>
        <Link href="/features/grocer" className="flex items-center justify-center gap-2 text-[#1a3d2b] hover:underline">
          <ArrowLeft size={16} /> All Grocers
        </Link>
      </div>
    </div>
  );

  const avatar = grocer.userId?.avatar || '';
  const fullName = grocer.userId?.fullName || '';
  const userName = grocer.userId?.userName || '';
  const location = grocer.location?.address || '';
  const savedCount = grocer.savedProduce?.length || 0;
  const likedCount = grocer.likedProduce?.length || 0;
  const followerCount = grocer.followers?.length || 0;

  return (
    <ProtectedRoute>
      <div className="bg-[#f5f0e8] min-h-screen pb-20">

        {/* Header */}
        <div className="bg-[#1a3d2b] py-16 px-6 relative overflow-hidden">
          <span
            className="text-[8rem] font-black text-white/10 uppercase select-none whitespace-nowrap absolute right-4 top-1/2 -translate-y-1/2"
            style={{ writingMode: 'vertical-rl' }}
          >
            {grocer.shopName}
          </span>

          <Link href="/features/grocer"
            className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} /> All Grocers
          </Link>

          {isOwner && (
            <div className="absolute top-4 right-6">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-1.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {loggingOut ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                {loggingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          )}

          <div className="max-w-5xl mx-auto relative">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a] mb-2">Verified Grocer</p>
            <h1 className="text-5xl font-black text-white uppercase tracking-tight mb-4">
              {grocer.shopName}
            </h1>
            <div className="w-12 h-0.5" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Profile Info */}
          <div className="flex items-start gap-6 mb-10">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl shrink-0 bg-[#1a3d2b]/10">
              {avatar ? (
                <Image src={avatar} alt={fullName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#1a3d2b] font-black text-4xl">
                  {fullName?.[0] ?? 'G'}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight">{fullName}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#e86c2a] mb-2">@{userName}</p>
              {location && (
                <div className="flex items-center gap-1 text-[#8a9a8e]">
                  <MapPin size={11} className="text-[#e86c2a]" />
                  <span className="text-[10px]">{location}</span>
                </div>
              )}
            </div>

            {!isOwner && (
              <div className="flex gap-2">
                <button onClick={toggle}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-colors border ${
                    isFollowing
                      ? 'bg-[#f5f0e8] text-[#1a3d2b] border-[#1a3d2b]/30'
                      : 'bg-[#1a3d2b] text-[#e8c84a] border-[#1a3d2b] hover:bg-[#2a5a3b]'
                  }`}
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
                <button className="flex items-center gap-2 bg-[#e86c2a] text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-[#d45e1e] transition-colors">
                  <Phone size={12} /> Contact
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
         {/* Stats */}
<div className="grid grid-cols-3 gap-4 mb-10">
  <div className="bg-white border border-[#d4c9b0] rounded-2xl px-6 py-5 text-center">
    <p className="text-3xl font-black text-[#1a3d2b]">{displayFollowerCount}</p>
    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mt-1">FOLLOWERS</p>
  </div>
  <div className="bg-white border border-[#d4c9b0] rounded-2xl px-6 py-5 text-center">
    <p className="text-3xl font-black text-[#1a3d2b]">{displayFollowingCount}</p>
    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mt-1">FOLLOWING</p>
  </div>
  <div className="bg-white border border-[#d4c9b0] rounded-2xl px-6 py-5 text-center">
    <p className="text-3xl font-black text-[#1a3d2b]">{savedCount}</p>
    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mt-1">SAVED</p>
  </div>
</div>

          {/* Bio */}
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">About</p>
            <p className="text-sm text-[#4a5a4e] leading-relaxed">{grocer.bio || 'No bio provided yet.'}</p>
          </div>

          {/* Saved Produce */}
          {savedCount > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-1">Saved Produce</h2>
              <div className="w-10 h-0.5 mb-8" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
              <div className="flex flex-wrap gap-3">
                {grocer.savedProduce.map((produceId) => (
                  <Link
                    key={produceId}
                    href={`/features/produce/${produceId}`}
                    onClick={() => dispatch(markProduceVisited(produceId))}
                    className="flex items-center gap-2 bg-white border border-[#d4c9b0] rounded-xl px-4 py-2.5 hover:border-[#1a3d2b]/40 hover:shadow-sm transition-all"
                  >
                    <Package size={13} className="text-[#8a9a8e]" />
                    <span className="text-[11px] font-black text-[#1a3d2b] uppercase tracking-wide">View Produce</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}