'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Star, Phone, ArrowLeft,
  Package, Loader2, LogOut, Plus,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser }                      from '@/store/avatarSlice';
import { clearFollowing }                 from '@/store/followSlice';
import ProtectedRoute        from '@/components/ProtectedRoute';
import { clearSavedProduce, markProduceViewed } from '@/store/contentSlice';
import { useFollow }                      from '@/hooks/useFollow';
import { formatPrice, formatDate }        from '@/hooks/produceHelpers';

interface GrocerProfile {
  _id: string; name: string; owner: string; location: string; bio: string;
  avatar: string; coverImg: string; rating: number; totalReviews: number;
  yearsActive: number; categories: string[];
  partnerFarmers: { _id: string; name: string; avatar: string }[];
  produce: { _id: string; name: string; price: number; unit: string; img: string }[];
}

interface DashboardData {
  stats:          { label: string; value: string; delta: string }[];
  orders:         { id: string; buyer: string; items: number; amount: string; status: string; createdAt: string }[];
  partnerFarmers: { _id: string; name: string; status: string; produce: number }[];
}

const STATUS_STYLES: Record<string, string> = {
  Delivered:  'bg-[#1a3d2b]/10 text-[#1a3d2b]',
  Pending:    'bg-[#e86c2a]/10 text-[#e86c2a]',
  Processing: 'bg-[#e8c84a]/20 text-[#8a6a00]',
};

export default function GrocerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router      = useRouter();
  const dispatch    = useAppDispatch();
  const currentUser = useAppSelector((s) => s.avatar.user);

  const { id } = use(params); // ✅ Next.js 15 — params is a Promise

  const [grocer,     setGrocer]     = useState<GrocerProfile | null>(null);
  const [dash,       setDash]       = useState<DashboardData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const { isFollowing, toggle } = useFollow('grocer', id);
  const isOwner = currentUser?.id === id;

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`/api/grocer/${id}`);
        const data = await res.json();

        if (res.status === 401) { router.push('/features/auth/login'); return; }
        if (res.status === 403) { router.push('/unauthorized');         return; }
        if (!data.success)      { setGrocer(null);                      return; }

        setGrocer(data.grocer);

        if (isOwner) {
          const dashRes  = await fetch('/api/grocer/dashboard');
          const dashData = await dashRes.json();
          if (dashData.success) setDash(dashData.dashboard);
        }
      } catch {
        setGrocer(null);
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

  if (!grocer) return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center pt-20 gap-4">
      <p className="text-[#8a9a8e] text-sm">Grocer not found.</p>
      <Link href="/features/grocer"
        className="text-[11px] font-black uppercase tracking-widest text-[#1a3d2b] border-b border-[#1a3d2b] pb-0.5">
        ← All Grocers
      </Link>
    </div>
  );

  return (
    <ProtectedRoute allowedRole="grocer">
    <div className="min-h-screen bg-[#f5f0e8] pt-20">

      <div className="relative w-full h-56 overflow-hidden">
        <img src={grocer.coverImg} alt={grocer.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1a3d2b]/60" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />

        <Link href="/features/grocer"
          className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={13} /> All Grocers
        </Link>

        {isOwner && (
          <div className="absolute top-4 right-6 flex items-center gap-3">
            <Link href="/features/farmer"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#e8c84a] border border-[#e8c84a]/40 px-4 py-1.5 rounded-xl hover:bg-[#e8c84a]/10 transition-colors">
              <Plus size={11} /> Add Farmer
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

        <div className="relative -mt-14 mb-10 flex items-end gap-5">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#f5f0e8] shadow-xl flex-shrink-0">
            <img src={grocer.avatar} alt={grocer.name} className="w-full h-full object-cover" />
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />
          </div>

          <div className="pb-1">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-0.5">Verified Grocer</p>
            <h1 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight leading-none">{grocer.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-[#8a9a8e]">
              <span className="flex items-center gap-1"><MapPin size={11} className="text-[#e86c2a]" />{grocer.location}</span>
              <span className="flex items-center gap-1">
                <Star size={11} className="fill-[#e86c2a] text-[#e86c2a]" />
                <b className="text-[#1a3d2b]">{grocer.rating}</b> ({grocer.totalReviews})
              </span>
            </div>
          </div>

          {!isOwner && (
            <div className="ml-auto pb-1 flex gap-2">
              <button onClick={toggle}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-colors border ${
                  isFollowing
                    ? 'bg-[#f5f0e8] text-[#1a3d2b] border-[#1a3d2b]/30'
                    : 'bg-white border-[#d4c9b0] text-[#1a3d2b] hover:border-[#1a3d2b]/40'
                }`}>{isFollowing ? 'Following' : '+ Follow'}</button>
              <button className="flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors">
                <Phone size={12} /> Contact
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {(isOwner && dash?.stats
            ? dash.stats.slice(0, 3).map((s) => ({ label: s.label, val: s.value }))
            : [
                { label: 'Years Active',   val: grocer.yearsActive },
                { label: 'Reviews',        val: grocer.totalReviews },
                { label: 'Partner Farms',  val: grocer.partnerFarmers.length },
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
            <p className="text-sm text-[#4a5a4e] leading-relaxed">{grocer.bio}</p>
          </div>
          <div className="col-span-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">Partner Farmers</p>
            <div className="space-y-2">
              {grocer.partnerFarmers.map((f) => (
                <Link key={f._id} href={`/features/farmer/${f._id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#d4c9b0] hover:border-[#1a3d2b]/40 transition-colors">
                  <img src={f.avatar} alt={f.name} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-[11px] font-black text-[#1a3d2b] uppercase">{f.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {grocer.produce?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-1">Available Produce</h2>
            <div className="w-10 h-[2px] mb-8" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
            <div className="grid grid-cols-3 gap-5">
              {grocer.produce.map((p) => (
                <Link key={p._id} href={`/features/produce/${p._id}`}
                  onClick={() => dispatch(markProduceViewed(p._id))}
                  className="bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden hover:border-[#1a3d2b]/40 hover:shadow-md transition-all group">
                  <div className="relative w-full h-36 overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black text-[#1a3d2b] uppercase">{p.name}</p>
                      <p className="text-[10px] text-[#8a9a8e]">₹{p.price} / {p.unit}</p>
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
            <div className="col-span-8 bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden">
              <div className="bg-[#1a3d2b] px-6 py-4">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#e8c84a]/50">Latest</p>
                <p className="text-base font-black text-white uppercase">Recent Orders</p>
              </div>
              <div className="divide-y divide-[#f0ebe0]">
                {dash.orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#f5f0e8]/50">
                    <div>
                      <p className="text-[11px] font-black text-[#1a3d2b] uppercase">{o.buyer}</p>
                      <p className="text-[10px] text-[#8a9a8e]">{o.items} item{o.items > 1 ? 's' : ''} · {formatDate(o.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-[13px] font-black text-[#1a3d2b]">{formatPrice(Number(o.amount.replace(/[^0-9]/g, '')))}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] ?? ''}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-4 bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden">
              <div className="bg-[#1a3d2b] px-6 py-4">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#e8c84a]/50">Network</p>
                <p className="text-base font-black text-white uppercase">Partner Farmers</p>
              </div>
              <div className="divide-y divide-[#f0ebe0]">
                {dash.partnerFarmers.map((f) => (
                  <div key={f._id} className="flex items-center justify-between px-5 py-4 hover:bg-[#f5f0e8]/50">
                    <div>
                      <p className="text-[11px] font-black text-[#1a3d2b] uppercase">{f.name}</p>
                      <p className="text-[10px] text-[#8a9a8e]">{f.produce} products</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      f.status === 'Active' ? 'bg-[#1a3d2b]/10 text-[#1a3d2b]' : 'bg-[#e8c84a]/20 text-[#8a6a00]'
                    }`}>{f.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}