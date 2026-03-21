'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, ArrowLeft, Package,
  Loader2, LogOut, ShoppingBag,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser }                      from '@/store/avatarSlice';
import { clearFollowing }                 from '@/store/followSlice';
import { clearSavedProduce, markProduceVisited } from '@/store/contentSlice';

interface BuyerProfile {
  id:          string;
  userName:    string;
  fullName:    string;
  email:       string;
  accountType: string;
  avatar:      string | null;
  createdAt:   string;
  lastLogin:   string;
  profile: {
    savedProduce:      string[];
    following:         string[];
    deliveryAddresses: { label: string; address: string }[];
    mediaUrl:          string;
  };
}

interface DashboardData {
  stats:       { label: string; value: string }[];
  savedProduce: { _id: string; name: string; price: number; unit: string; img: string; isOrganic: boolean }[];
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BuyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router      = useRouter();
  const dispatch    = useAppDispatch();
  const currentUser = useAppSelector((s) => s.avatar.user);
  const { id } = use(params);

  const [buyer,      setBuyer]      = useState<BuyerProfile | null>(null);
  const [dash,       setDash]       = useState<DashboardData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const isOwner = currentUser?.id === id;

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`/api/buyer/${id}`);
        const data = await res.json();

        if (res.status === 401) { router.push('/features/auth/login'); return; }
        if (res.status === 403) { router.push('/unauthorized');         return; }
        if (!data.success)      { setBuyer(null); return; }

        setBuyer(data.buyer);

        if (isOwner) {
          const dashRes  = await fetch('/api/buyer/dashboard');
          const dashData = await dashRes.json();
          if (dashData.success) setDash(dashData.dashboard);
        }
      } catch (err) {
        console.error(err);
        setBuyer(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router, isOwner]);

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
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center pt-20">
      <Loader2 className="w-8 h-8 text-[#1a3d2b] animate-spin" />
    </div>
  );

  if (!buyer) return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center pt-20 gap-4">
      <p className="text-[#8a9a8e] text-sm">Buyer not found.</p>
      <Link href="/"
        className="text-[11px] font-black uppercase tracking-widest text-[#1a3d2b] border-b border-[#1a3d2b] pb-0.5">
        ← Home
      </Link>
    </div>
  );

  const p = buyer.profile;

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-20">

      {/* Cover — color block since buyers have no coverImg */}
      <div className="relative w-full h-56 bg-[#1a3d2b] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />
        <div className="absolute right-0 top-0 bottom-0 w-32 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="text-[8rem] font-black text-white/4 uppercase select-none whitespace-nowrap"
            style={{ writingMode: 'vertical-rl' }}
          >
            {buyer.userName}
          </span>
        </div>

        <Link href="/"
          className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={13} /> Home
        </Link>

        {isOwner && (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="absolute top-4 right-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-1.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {loggingOut ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6">

        {/* Profile header */}
        <div className="relative -mt-14 mb-10 flex items-end gap-5">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#f5f0e8] shadow-xl flex-shrink-0 bg-[#1a3d2b]/10">
            {buyer.avatar ? (
              <Image src={buyer.avatar} alt={buyer.fullName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#1a3d2b] font-black text-4xl">
                {buyer.fullName?.[0] ?? 'B'}
              </div>
            )}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />
          </div>

          <div className="pb-1">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-0.5">Buyer</p>
            <h1 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight leading-none">
              {buyer.fullName}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-[#8a9a8e]">
              <span>@{buyer.userName}</span>
              {p.deliveryAddresses?.[0] && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-[#e86c2a]" />
                  {p.deliveryAddresses[0].address}
                </span>
              )}
              <span>Joined {formatDate(buyer.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {(dash?.stats ?? [
            { label: 'Saved Items', value: String(p.savedProduce?.length  ?? 0) },
            { label: 'Following',   value: String(p.following?.length     ?? 0) },
            { label: 'Addresses',   value: String(p.deliveryAddresses?.length ?? 0) },
          ]).map(({ label, value }) => (
            <div key={label} className="bg-white border border-[#d4c9b0] rounded-2xl px-6 py-5 text-center">
              <p className="text-3xl font-black text-[#1a3d2b]">{value}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Delivery addresses */}
        {p.deliveryAddresses?.length > 0 && (
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">
              Delivery Addresses
            </p>
            <div className="flex flex-wrap gap-2">
              {p.deliveryAddresses.map((addr, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#1a3d2b]/10 text-[#1a3d2b] border border-[#1a3d2b]/15"
                >
                  <MapPin size={9} />
                  {addr.label ? `${addr.label} — ` : ''}{addr.address}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Saved produce — only visible to owner via dashboard */}
        {isOwner && dash && dash.savedProduce.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-1">
              Saved Produce
            </h2>
            <div className="w-10 h-[2px] mb-8" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
            <div className="grid grid-cols-3 gap-5">
              {dash.savedProduce.map((item) => (
                <Link
                  key={item._id}
                  href={`/features/produce/${item._id}`}
                  onClick={() => dispatch(markProduceVisited(item._id))}
                  className="bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden hover:border-[#1a3d2b]/40 hover:shadow-md transition-all group"
                >
                  <div className="relative w-full h-36 overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black text-[#1a3d2b] uppercase">{item.name}</p>
                      <p className="text-[10px] text-[#8a9a8e]">{formatPrice(item.price)} / {item.unit}</p>
                    </div>
                    <Package size={14} className="text-[#8a9a8e]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty saved state for owner */}
        {isOwner && dash && dash.savedProduce.length === 0 && (
          <div className="mb-12 text-center py-16 border border-dashed border-[#d4c9b0] rounded-2xl">
            <ShoppingBag size={28} className="text-[#1a3d2b]/20 mx-auto mb-3" />
            <p className="text-[11px] font-black uppercase tracking-widest text-[#8a9a8e]">
              No saved produce yet
            </p>
            <Link
              href="/features/produce"
              className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl bg-[#1a3d2b] text-[#e8c84a] hover:bg-[#1a3d2b]/90 transition-colors"
            >
              Browse Produce
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}