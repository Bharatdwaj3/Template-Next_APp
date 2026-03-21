'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Star, Leaf, Phone, ArrowLeft,
  Package, Loader2, LogOut, Plus, Edit,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser }           from '@/store/avatarSlice';
import { clearFollowing }      from '@/store/followSlice';
import { clearSavedProduce, markProduceVisited } from '@/store/contentSlice';
import { useFollow }           from '@/hooks/useFollow';

interface FarmerProfile {
  _id:      string;
  userName: string;
  fullName: string;
  profile: {
    bio:          string;
    farmName:     string;
    location:     string;
    avatar:       string;
    coverImg:     string;
    rating:       number;
    totalReviews: number;
    yearsActive:  number;
    isOrganic:    boolean;
    interests:    string[];
    produce:      { _id: string; name: string; price: number; unit: string; img: string }[];
  };
}

interface DashboardData {
  stats:    { label: string; value: string; delta: string }[];
  orders:   { id: string; buyer: string; produce: string; amount: string; status: string; createdAt: string }[];
  listings: { _id: string; name: string; price: number; stock: string; status: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  Delivered:  'bg-[#1a3d2b]/10 text-[#1a3d2b]',
  Pending:    'bg-[#e86c2a]/10 text-[#e86c2a]',
  Processing: 'bg-[#e8c84a]/20 text-[#8a6a00]',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function FarmerProfilePage({ params }: { params: { id: string } }) {
  const router      = useRouter();
  const dispatch    = useAppDispatch();
  const currentUser = useAppSelector((s) => s.avatar.user);

  const [farmer,     setFarmer]     = useState<FarmerProfile | null>(null);
  const [dash,       setDash]       = useState<DashboardData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const { isFollowing, toggle } = useFollow('farmer', params.id);
  const isOwner = currentUser?.id === params.id;

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`/api/farmer/${params.id}`);
        const data = await res.json();

        if (res.status === 401) { router.push('/features/auth/login'); return; }
        if (res.status === 403) { router.push('/unauthorized');         return; }
        if (!data.success)      { setFarmer(null); return; }

        setFarmer(data.farmer);

        if (currentUser?.id === params.id) {
          const dashRes  = await fetch('/api/farmer/dashboard');
          const dashData = await dashRes.json();
          if (dashData.success) setDash(dashData.dashboard);
        }
      } catch (err) {
        console.error(err);
        setFarmer(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, router, currentUser?.id]);

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

  if (!farmer) return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center pt-20 gap-4">
      <p className="text-[#8a9a8e] text-sm">Farmer not found.</p>
      <Link href="/features/farmer"
        className="text-[11px] font-black uppercase tracking-widest text-[#1a3d2b] border-b border-[#1a3d2b] pb-0.5">
        ← All Farmers
      </Link>
    </div>
  );

  const p = farmer.profile;

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-20">

      {/* Cover */}
      <div className="relative w-full h-56 overflow-hidden">
        <img src={p.coverImg} alt={p.farmName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1a3d2b]/60" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />

        <Link href="/features/farmer"
          className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={13} /> All Farmers
        </Link>

        {isOwner && (
          <div className="absolute top-4 right-6 flex items-center gap-3">
            <Link href="/features/produce/new"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#e8c84a] border border-[#e8c84a]/40 px-4 py-1.5 rounded-xl hover:bg-[#e8c84a]/10 transition-colors">
              <Plus size={11} /> New Listing
            </Link>
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
      </div>

      <div className="max-w-5xl mx-auto px-6">

        {/* Profile header */}
        <div className="relative -mt-14 mb-10 flex items-end gap-5">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#f5f0e8] shadow-xl flex-shrink-0">
            <img src={p.avatar} alt={farmer.fullName} className="w-full h-full object-cover" />
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />
          </div>
          <div className="pb-1">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-0.5">Verified Farmer</p>
            <h1 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight leading-none">{p.farmName}</h1>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-[#8a9a8e]">
              <span className="flex items-center gap-1"><MapPin size={11} className="text-[#e86c2a]" />{p.location}</span>
              <span className="flex items-center gap-1">
                <Star size={11} className="fill-[#e86c2a] text-[#e86c2a]" />
                <b className="text-[#1a3d2b]">{p.rating}</b> ({p.totalReviews})
              </span>
              {p.isOrganic && (
                <span className="flex items-center gap-1 font-bold text-[#1a3d2b]"><Leaf size={11} /> Organic</span>
              )}
            </div>
          </div>

          {!isOwner && (
            <div className="ml-auto pb-1 flex gap-2">
              <button onClick={toggle}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-colors border ${
                  isFollowing
                    ? 'bg-[#f5f0e8] text-[#1a3d2b] border-[#1a3d2b]/30'
                    : 'bg-white border-[#d4c9b0] text-[#1a3d2b] hover:border-[#1a3d2b]/40'
                }`}>
                {isFollowing ? 'Following' : '+ Follow'}
              </button>
              <button className="flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors">
                <Phone size={12} /> Contact
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {(isOwner && dash?.stats
            ? dash.stats.slice(0, 3).map((s) => ({ label: s.label, val: s.value }))
            : [
                { label: 'Years Active', val: p.yearsActive },
                { label: 'Reviews',      val: p.totalReviews },
                { label: 'Products',     val: p.produce?.length ?? 0 },
              ]
          ).map(({ label, val }) => (
            <div key={label} className="bg-white border border-[#d4c9b0] rounded-2xl px-6 py-5 text-center">
              <p className="text-3xl font-black text-[#1a3d2b]">{val}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-8">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">About</p>
            <p className="text-sm text-[#4a5a4e] leading-relaxed">{p.bio}</p>
          </div>
          <div className="col-span-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {p.interests?.map((s) => (
                <span key={s} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#1a3d2b]/10 text-[#1a3d2b] border border-[#1a3d2b]/15">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {p.produce?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-1">
              {isOwner ? 'My Produce' : 'Their Produce'}
            </h2>
            <div className="w-10 h-[2px] mb-8" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
            <div className="grid grid-cols-3 gap-5">
              {p.produce.map((item) => (
                <Link key={item._id} href={`/features/produce/${item._id}`}
                  onClick={() => dispatch(markProduceVisited(item._id))}
                  className="bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden hover:border-[#1a3d2b]/40 hover:shadow-md transition-all group">
                  <div className="relative w-full h-36 overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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

        {isOwner && dash && (
          <div className="grid grid-cols-12 gap-6 mb-16">
            <div className="col-span-7 bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden">
              <div className="bg-[#1a3d2b] px-6 py-4">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#e8c84a]/50">Latest</p>
                <p className="text-base font-black text-white uppercase">Recent Orders</p>
              </div>
              <div className="divide-y divide-[#f0ebe0]">
                {dash.orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#f5f0e8]/50">
                    <div>
                      <p className="text-[11px] font-black text-[#1a3d2b] uppercase">{o.buyer}</p>
                      <p className="text-[10px] text-[#8a9a8e]">{o.produce} · {formatDate(o.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-[13px] font-black text-[#1a3d2b]">{o.amount}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] ?? ''}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-5 bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden">
              <div className="bg-[#1a3d2b] px-6 py-4">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#e8c84a]/50">Inventory</p>
                <p className="text-base font-black text-white uppercase">My Listings</p>
              </div>
              <div className="divide-y divide-[#f0ebe0]">
                {dash.listings.map((l) => (
                  <div key={l._id} className="flex items-center justify-between px-5 py-4 hover:bg-[#f5f0e8]/50 group">
                    <div>
                      <p className="text-[11px] font-black text-[#1a3d2b] uppercase">{l.name}</p>
                      <p className="text-[10px] text-[#8a9a8e]">{formatPrice(l.price)} · {l.stock} left</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        l.status === 'Active' ? 'bg-[#1a3d2b]/10 text-[#1a3d2b]' : 'bg-[#e86c2a]/10 text-[#e86c2a]'
                      }`}>{l.status}</span>
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#1a3d2b]/10 rounded-lg">
                        <Edit size={12} className="text-[#8a9a8e]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}