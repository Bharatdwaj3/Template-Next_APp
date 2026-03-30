// features/buyer/[id]/page.tsx
'use client';
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, ArrowLeft, Package, Loader2, LogOut,
  Users, Heart, ShoppingBasket, Eye,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser } from '@/store/avatarSlice';
import { clearFollowing } from '@/store/followSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import { clearSavedProduce, markProduceVisited } from '@/store/contentSlice';
import { useFollow } from '@/hooks/useFollow';

interface BuyerProfile {
  _id: string;
  bio: string;
  location: { address?: string; coordinates?: [number, number] };
  followers: string[];
  following: string[];
  savedProduce: string[];
  likedProduce: string[];
  mediaUrl: string;
  cloudinaryId: string;
  createdAt: string;
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

interface Order {
  _id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    _id: string;
    name: string;
    quantity: number;
    price: number;
    img?: string;
  }>;
}

export default function BuyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.avatar.user);
  const { id } = use(params);
  const [buyer, setBuyer] = useState<BuyerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { isFollowing, toggle } = useFollow('buyer', id);
  const isOwner = currentUser?.id === id;

  useEffect(() => {
    const loadBuyer = async () => {
      try {
        const res = await fetch(`/api/buyer/profile/${id}`);
        const data = await res.json();
        if (res.status === 401) { router.push('/features/auth/login'); return; }
        if (res.status === 403) { router.push('/unauthorized'); return; }
        if (!data.success) { setBuyer(null); return; }
        setBuyer(data.buyer);
      } catch (err) {
        console.error(err);
        setBuyer(null);
      } finally {
        setLoading(false);
      }
    };
    loadBuyer();
  }, [id, router]);

  useEffect(() => {
    if (activeTab === 0) {
      const loadOrders = async () => {
        try {
          setOrdersLoading(true);
          const res = await fetch('/api/payments/orders');
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders);
          }
        } catch (err) {
          console.error('Failed to fetch orders:', err);
        } finally {
          setOrdersLoading(false);
        }
      };
      loadOrders();
    }
  }, [activeTab]);

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
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[#1a3d2b]" size={40} />
    </div>
  );

  if (!buyer) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#1a3d2b] font-bold mb-4">Buyer not found.</p>
        <Link href="/features/buyer" className="text-[#e86c2a] hover:underline">
          ← All Buyers
        </Link>
      </div>
    </div>
  );

  const avatar = buyer.userId?.avatar || '';
  const fullName = buyer.userId?.fullName || '';
  const userName = buyer.userId?.userName || '';
  const location = buyer.location?.address || '';
  const followerCount = buyer.followers?.length ?? 0;
  const followingCount = buyer.following?.length ?? 0;
  const savedCount = buyer.savedProduce?.length ?? 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f5f0e8] relative overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a3d2b] py-16 px-6 relative">
          <span
            className="text-[8rem] font-black text-white/10 uppercase select-none whitespace-nowrap absolute right-4 top-1/2 -translate-y-1/2"
            style={{ writingMode: 'vertical-rl' }}
          >
            {userName}
          </span>
          
          <Link href="/features/buyer"
            className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={13} /> All Buyers
          </Link>

          {isOwner && (
            <div className="absolute top-4 right-6">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-1.5 rounded-xl transition-colors disabled:opacity-50">
                {loggingOut ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                {loggingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-6">
          {/* Profile Header */}
          <div className="relative -mt-14 mb-10 flex items-end gap-5">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#f5f0e8] shadow-xl shrink-0 bg-[#1a3d2b]/10">
              {avatar ? (
                <Image src={avatar} alt={fullName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#1a3d2b] font-black text-4xl">
                  {fullName?.[0] ?? 'B'}
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-0.75 bg-[#e8c84a]" />
            </div>

            <div className="pb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-0.5">
                Verified Buyer
              </p>
              <h1 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight leading-none">
                {fullName}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-[#8a9a8e]">
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} className="text-[#e86c2a]" />{location}
                  </span>
                )}
                <span>@{userName}</span>
              </div>
            </div>

            {!isOwner && (
              <div className="ml-auto pb-1">
                <button onClick={toggle}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-colors border ${
                    isFollowing
                      ? 'bg-[#f5f0e8] text-[#1a3d2b] border-[#1a3d2b]/30'
                      : 'bg-white border-[#d4c9b0] text-[#1a3d2b] hover:border-[#1a3d2b]/40'
                  }`}>
                  {isFollowing ? 'Following' : '+ Follow'}
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Followers', val: followerCount, icon: Users },
              { label: 'Following', val: followingCount, icon: Users },
              { label: 'Orders', val: orders.length, icon: Package },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} className="bg-white border border-[#d4c9b0] rounded-2xl px-6 py-5 text-center">
                <p className="text-3xl font-black text-[#1a3d2b]">{val}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* About Section */}
          <div className="grid grid-cols-12 gap-8 mb-12">
            <div className="col-span-8">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">About</p>
              <p className="text-sm text-[#4a5a4e] leading-relaxed">
                {buyer.bio || 'No bio provided yet.'}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">Member Since</p>
              <p className="text-sm font-bold text-[#1a3d2b]">
                {new Date(buyer.createdAt).toLocaleDateString('en-IN', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              {savedCount > 0 && (
                <>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3 mt-4">Saved Items</p>
                  <p className="text-sm font-bold text-[#1a3d2b]">{savedCount} products saved</p>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-white rounded-xl p-1.5 border border-[#d4c9b0] w-fit">
            {['My Orders', 'Saved Produce', 'Activity'].map((label, i) => (
              <button
                key={label}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === i
                    ? 'bg-[#1a3d2b] text-[#e8c84a] shadow-sm'
                    : 'text-[#4a5a4e] hover:text-[#1a3d2b] hover:bg-[#f5f0e8]/50'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {/* Orders Tab */}
            {activeTab === 0 && (
              <div>
                <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-6">
                  Order History
                </h2>

                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-[#1a3d2b]" size={32} />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white border border-[#d4c9b0] rounded-xl p-5 hover:border-[#1a3d2b]/40 hover:shadow-md transition-all">
                        <div className="flex flex-wrap justify-between items-start mb-4">
                          <div>
                            <p className="text-sm font-bold text-[#1a3d2b]">
                              Order #{order.orderId.slice(-8)}
                            </p>
                            <p className="text-xs text-[#8a9a8e] mt-1">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="border-t border-[#d4c9b0] pt-4 mb-4">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 mb-2">
                              {item.img && (
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f5f0e8]">
                                  <Image src={item.img} alt={item.name} width={40} height={40} className="object-cover" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-bold text-[#1a3d2b]">{item.name}</p>
                                <p className="text-[10px] text-[#8a9a8e]">{item.quantity} × ₹{item.price}</p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-[#8a9a8e] mt-2">+ {order.items.length - 3} more items</p>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-lg font-black text-[#e86c2a]">₹{order.totalAmount.toFixed(0)}</p>
                          <Link
                            href={`/features/orders/${order.orderId}`}
                            className="flex items-center gap-2 text-[10px] font-bold text-[#1a3d2b] hover:underline">
                            <Eye size={12} /> View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-[#d4c9b0] rounded-2xl p-12 text-center">
                    <Package size={48} className="mx-auto text-[#8a9a8e] mb-4" />
                    <p className="text-lg text-[#1a3d2b] font-semibold mb-2">No orders yet</p>
                    <p className="text-sm text-[#8a9a8e] mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Link
                      href="/features/produce"
                      className="inline-flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] px-5 py-2.5 rounded-xl hover:bg-[#2a5a3b] transition-colors font-bold text-sm">
                      <ShoppingBasket size={16} /> Browse Produce
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Saved Produce Tab */}
            {activeTab === 1 && (
              <div>
                <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-6">
                  Saved Produce
                </h2>

                {savedCount > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {buyer.savedProduce.map((produceId) => (
                      <Link
                        key={produceId}
                        href={`/features/produce/${produceId}`}
                        onClick={() => dispatch(markProduceVisited(produceId))}
                        className="bg-white border border-[#d4c9b0] rounded-xl p-4 hover:border-[#1a3d2b]/40 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3">
                          <Package size={16} className="text-[#8a9a8e]" />
                          <span className="text-sm font-bold text-[#1a3d2b]">View Product Details</span>
                        </div>
                        <p className="text-[10px] text-[#8a9a8e] mt-1">ID: {produceId.slice(-8)}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-[#d4c9b0] rounded-2xl p-12 text-center">
                    <Heart size={48} className="mx-auto text-[#8a9a8e] mb-4" />
                    <p className="text-lg text-[#1a3d2b] font-semibold mb-2">No saved produce</p>
                    <p className="text-sm text-[#8a9a8e] mb-6">
                      Save products to quickly find them later
                    </p>
                    <Link
                      href="/features/produce"
                      className="inline-flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] px-5 py-2.5 rounded-xl hover:bg-[#2a5a3b] transition-colors font-bold text-sm">
                      Browse Produce
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 2 && (
              <div>
                <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-6">
                  Recent Activity
                </h2>
                <div className="bg-white border border-[#d4c9b0] rounded-2xl p-12 text-center">
                  <ShoppingBasket size={48} className="mx-auto text-[#8a9a8e] mb-4" />
                  <p className="text-lg text-[#1a3d2b] font-semibold mb-2">Activity Feed</p>
                  <p className="text-sm text-[#8a9a8e] mb-6">
                    Your shopping activity will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}