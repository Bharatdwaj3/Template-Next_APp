// features/farmer/[id]/page.tsx

'use client';
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, ArrowLeft, Package, Loader2, LogOut, Plus, X,
  Users, ShoppingBasket, Edit, Trash2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser } from '@/store/avatarSlice';
import { clearFollowing } from '@/store/followSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import { clearSavedProduce, markProduceVisited } from '@/store/contentSlice';
import { useFollow } from '@/hooks/useFollow';

interface FarmerProfile {
  _id: string;
  bio: string;
  interests: string[];
  farmType: string[];
  produce: string[]; 
  location: { address?: string; coordinates?: [number, number] };
  followers: string[];
  following: string[];
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

interface ProduceItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  img: string;
  isOrganic: boolean;
  farmerId: {
    _id: string;
    userName: string;
    fullName: string;
  };
}

export default function FarmerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.avatar.user);
  const { id } = use(params);
  
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [produceList, setProduceList] = useState<ProduceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [produceloading, setProduceLoading] = useState(false);
  
  const { isFollowing, toggle } = useFollow('farmer', id);
  const isOwner = currentUser?.id === id;

  useEffect(() => {
    const loadFarmer = async () => {
      try {
        const res = await fetch(`/api/farmer/profile/${id}`);
        const data = await res.json();
        if (res.status === 401) { router.push('/features/auth/login'); return; }
        if (res.status === 403) { router.push('/unauthorized'); return; }
        if (!data.success) { setFarmer(null); return; }
        setFarmer(data.farmer);
      } catch (err) {
        console.error(err);
        setFarmer(null);
      } finally {
        setLoading(false);
      }
    };
    loadFarmer();
  }, [id, router]);

  useEffect(() => {
    if (!farmer?.produce?.length) {
      setProduceList([]);
      return;
    }
    
    const loadProduce = async () => {
      try {
        setProduceLoading(true);
        const res = await fetch('/api/produce/details/');
        const data = await res.json();
        if (data.success) {
          const farmerProduce = data.produce.filter((p: ProduceItem) => 
            farmer.produce.includes(p._id)
          );
          setProduceList(farmerProduce);
        }
      } catch (err) {
        console.error('Failed to fetch produce:', err);
      } finally {
        setProduceLoading(false);
      }
    };
    loadProduce();
  }, [farmer?.produce]);

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

  const formRef = React.useRef<HTMLDivElement>(null);

  const handleCreateProduce = async () => {
    if (!formRef.current) return;

    const formData = new FormData();
    const inputs = formRef.current.querySelectorAll('input, select, textarea');

    console.log('=== FORM DATA BEING SENT ===');
    inputs.forEach((el: any) => {
      if (!el.name) return;
      if (el.type === 'file') {
        if (el.files[0]) {
          formData.append('image', el.files[0]);
          console.log(`📎 File: ${el.name} = ${el.files[0].name}`);
        }
      } else if (el.type === 'checkbox') {
        const value = el.checked ? 'true' : 'false';
        formData.append(el.name, value);
        console.log(`Checkbox: ${el.name} = ${value}`);
      } else if (el.value !== '') {
        formData.append(el.name, el.value);
      } else {
        console.log(`Empty field: ${el.name}`);
      }
    });

    console.log('=== ALL FORM DATA ENTRIES ===');
    for (const pair of formData.entries()) {
      console.log(pair[0], '=', pair[1]);
    }

    try {
      console.log('Sending request...');
      const res = await fetch('/api/produce/details/', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        setShowCreateModal(false);
        
        if (formRef.current) {
          const formInputs = formRef.current.querySelectorAll('input, select, textarea');
          formInputs.forEach((el: any) => {
            if (el.type === 'file') {
              el.value = '';
            } else if (el.type === 'checkbox') {
              el.checked = false;
            } else if (el.type !== 'submit' && el.type !== 'button') {
              el.value = '';
            }
          });
        }
        
        const farmerRes = await fetch(`/api/farmer/profile/${id}`);
        const farmerData = await farmerRes.json();
        if (farmerData.success) setFarmer(farmerData.farmer);
        
        const listRes = await fetch('/api/produce/details/');
        const listData = await listRes.json();
        if (listData.success) {
          const updatedIds: string[] = farmerData.farmer?.produce ?? [];
          setProduceList(listData.produce.filter((p: ProduceItem) => updatedIds.includes(p._id)));
        }
      } else {
        alert(data.message || 'Failed to create produce');
      }
    } catch (err) {
      console.error('Create produce error:', err);
      alert('Failed to create produce');
    }
  };

  const handleDeleteProduce = async (produceId: string) => {
    if (!confirm('Delete this produce listing?')) return;
    
    try {
      const res = await fetch(`/api/produce/details/${produceId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        setProduceList(prev => prev.filter(p => p._id !== produceId));
      }
    } catch (err) {
      console.error('Delete produce error:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <Loader2 className="animate-spin text-[#1a3d2b]" size={40} />
    </div>
  );

  if (!farmer) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="text-center">
        <p className="text-lg text-[#1a3d2b] mb-4">Farmer not found.</p>
        <Link href="/features/farmer" className="text-[#e86c2a] hover:underline flex items-center gap-2 justify-center">
          <ArrowLeft size={16} /> All Farmers
        </Link>
      </div>
    </div>
  );

  const avatar = farmer.userId?.avatar || '';
  const fullName = farmer.userId?.fullName || '';
  const userName = farmer.userId?.userName || '';
  const location = farmer.location?.address || '';
  const isOrganic = farmer.farmType?.includes('organic') || farmer.farmType?.includes('natural');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f5f0e8]">
        <div className="relative h-48 bg-linear-to-r from-[#1a3d2b] to-[#2a5a3b]">
          <span
            className="text-[8rem] font-black text-white/10 uppercase select-none whitespace-nowrap absolute right-4 top-1/2 -translate-y-1/2"
            style={{ writingMode: 'vertical-rl' }}
          >
            {userName}
          </span>
          <Link href="/features/farmer"
            className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={13} /> All Farmers
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
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="relative -mt-14 mb-10 flex items-end gap-5">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#f5f0e8] shadow-xl shrink-0 bg-[#1a3d2b]/10">
              {avatar ? (
                <Image src={avatar} alt={fullName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#1a3d2b] font-black text-4xl">
                  {fullName?.[0] ?? 'F'}
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-0.75 bg-[#e8c84a]" />
            </div>

            <div className="pb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-0.5">Verified Farmer</p>
              <h1 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight leading-none">{fullName}</h1>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-[#8a9a8e]">
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} className="text-[#e86c2a]" />{location}
                  </span>
                )}
                {isOrganic && (
                  <span className="font-bold text-[#1a3d2b]">🌿 Organic</span>
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

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Followers', val: farmer.followers?.length ?? 0, icon: Users },
              { label: 'Following', val: farmer.following?.length ?? 0, icon: Users },
              { label: 'Products', val: farmer.produce?.length ?? 0, icon: Package },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} className="bg-white border border-[#d4c9b0] rounded-2xl px-6 py-5 text-center">
                <p className="text-3xl font-black text-[#1a3d2b]">{val}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-8 mb-12">
            <div className="col-span-8">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">About</p>
              <p className="text-sm text-[#4a5a4e] leading-relaxed">{farmer.bio}</p>
            </div>
            <div className="col-span-4">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">Specialties</p>
              <div className="flex flex-wrap gap-2">
                {farmer.interests?.map((s) => (
                  <span key={s} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#1a3d2b]/10 text-[#1a3d2b] border border-[#1a3d2b]/15">{s}</span>
                ))}
              </div>
              {farmer.farmType?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {farmer.farmType.map((t) => (
                    <span key={t} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#e8c84a]/20 text-[#8a6a00] border border-[#e8c84a]/30">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-1 mb-8 bg-white rounded-xl p-1.5 border border-[#d4c9b0] w-fit">
            {['Produce', 'Sellers', 'Buyers'].map((label, i) => (
              <button
                key={label}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === i
                    ? 'bg-[#1a3d2b] text-[#e8c84a] shadow-sm'
                    : 'text-[#4a5a4e] hover:text-[#1a3d2b] hover:bg-[#f5f0e8]/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="min-h-96">
            {activeTab === 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight">
                    My Produce
                  </h2>
                  {isOwner && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] px-5 py-2.5 rounded-xl hover:bg-[#2a5a3b] transition-colors font-bold text-sm"
                    >
                      <Plus size={16} /> Create Produce
                    </button>
                  )}
                </div>

                {produceloading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-[#1a3d2b]" size={32} />
                  </div>
                ) : produceList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {produceList.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white border border-[#d4c9b0] rounded-xl p-4 hover:border-[#1a3d2b]/40 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {item.img && (
                              <Image
                                src={item.img}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="text-sm font-bold text-[#1a3d2b]">{item.name}</h3>
                              <p className="text-[10px] text-[#8a9a8e]">₹{item.price}/{item.unit}</p>
                            </div>
                          </div>
                          {isOwner && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                href={`/features/produce/${item._id}/edit`}
                                className="p-1.5 hover:bg-[#f5f0e8] rounded-lg"
                              >
                                <Edit size={14} className="text-[#8a9a8e]" />
                              </Link>
                              <button
                                onClick={() => handleDeleteProduce(item._id)}
                                className="p-1.5 hover:bg-[#e86c2a]/10 rounded-lg"
                              >
                                <Trash2 size={14} className="text-[#e86c2a]" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-[#4a5a4e] mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                            item.stock > 10 ? 'bg-[#1a3d2b]/10 text-[#1a3d2b]' : 'bg-[#e86c2a]/10 text-[#e86c2a]'
                          }`}>
                            {item.stock > 10 ? 'In Stock' : `Only ${item.stock} left`}
                          </span>
                          <Link
                            href={`/features/produce/${item._id}`}
                            onClick={() => dispatch(markProduceVisited(item._id))}
                            className="text-[10px] font-bold text-[#1a3d2b] hover:underline"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-[#d4c9b0] rounded-2xl p-12 text-center">
                    <Package size={48} className="mx-auto text-[#8a9a8e] mb-4" />
                    <p className="text-lg text-[#1a3d2b] font-semibold mb-2">
                      {isOwner ? 'No produce yet' : 'No produce listed'}
                    </p>
                    <p className="text-sm text-[#8a9a8e] mb-6">
                      {isOwner ? 'Create your first product listing' : 'This farmer hasn\'t listed any produce yet'}
                    </p>
                    {isOwner && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] px-5 py-2.5 rounded-xl hover:bg-[#2a5a3b] transition-colors font-bold text-sm mx-auto"
                      >
                        <Plus size={16} /> Create Your First Produce
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 1 && (
              <div>
                <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-6">
                  Other Sellers
                </h2>
                <div className="bg-white border border-[#d4c9b0] rounded-2xl p-12 text-center">
                  <Users size={48} className="mx-auto text-[#8a9a8e] mb-4" />
                  <p className="text-lg text-[#1a3d2b] font-semibold mb-2">Browse Sellers</p>
                  <p className="text-sm text-[#8a9a8e] mb-6">
                    Discover other farmers and sellers in the marketplace
                  </p>
                  <Link
                    href="/features/grocer"
                    className="inline-flex items-center gap-2 bg-[#1a3d2b] text-white px-5 py-2.5 rounded-xl hover:bg-[#2a5a3b] transition-colors font-bold text-sm"
                  >
                    <Users size={16} /> View All Sellers
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <h2 className="text-2xl font-black text-[#1a3d2b] uppercase tracking-tight mb-6">
                  Buyers & Grocers
                </h2>
                <div className="bg-white border border-[#d4c9b0] rounded-2xl p-12 text-center">
                  <ShoppingBasket size={48} className="mx-auto text-[#8a9a8e] mb-4" />
                  <p className="text-lg text-[#1a3d2b] font-semibold mb-2">Browse Buyers</p>
                  <p className="text-sm text-[#8a9a8e] mb-6">
                    Connect with grocers and buyers looking for fresh produce
                  </p>
                  <Link
                    href="/features/buyer"
                    className="inline-flex items-center gap-2 bg-[#e8c84a] text-[#1a3d2b] px-5 py-2.5 rounded-xl hover:bg-[#f0d46a] transition-colors font-bold text-sm"
                  >
                    <ShoppingBasket size={16} /> View All Buyers
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-[#d4c9b0]">
                <h3 className="text-xl font-black text-[#1a3d2b] uppercase tracking-tight">
                  Create New Produce
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-[#f5f0e8] rounded-lg transition-colors"
                >
                  <X size={20} className="text-[#8a9a8e]" />
                </button>
              </div>
              
              <div ref={formRef} className="p-6 space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#000000] mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2.5 border border-[#d4c9b0] rounded-xl focus:outline-none focus:border-[#1a3d2b] text-sm text-[#333333] placeholder:text-[#999999]"
                    placeholder="e.g., Organic Tomatoes"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#000000] mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      step="0.01"
                      className="w-full px-4 py-2.5 border border-[#d4c9b0] rounded-xl focus:outline-none focus:border-[#1a3d2b] text-sm text-[#333333] placeholder:text-[#999999]"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#000000] mb-2">
                      Unit *
                    </label>
                    <select
                      name="unit"
                      required
                      className="w-full px-4 py-2.5 border border-[#d4c9b0] rounded-xl focus:outline-none focus:border-[#1a3d2b] text-sm text-[#333333]"
                    >
                      <option value="" className="text-[#999999]">Select unit</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="lb">Pound (lb)</option>
                      <option value="piece">Piece</option>
                      <option value="dozen">Dozen</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#000000] mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-2.5 border border-[#d4c9b0] rounded-xl focus:outline-none focus:border-[#1a3d2b] text-sm text-[#333333]"
                  >
                    <option value="" className="text-[#999999]">Select category</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Root Veg">Root Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Grains">Grains</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#000000] mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    defaultValue="0"
                    className="w-full px-4 py-2.5 border border-[#d4c9b0] rounded-xl focus:outline-none focus:border-[#1a3d2b] text-sm text-[#333333]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#000000] mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-[#d4c9b0] rounded-xl focus:outline-none focus:border-[#1a3d2b] text-sm text-[#333333] placeholder:text-[#999999]"
                    placeholder="Describe your produce..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    id="organic"
                    className="w-4 h-4 border border-[#d4c9b0] rounded text-[#1a3d2b] focus:ring-[#1a3d2b]"
                  />
                  <label htmlFor="organic" className="text-sm text-[#4a5a4e]">
                    This is organic produce
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#000000] mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full px-4 py-2.5 border border-[#d4c9b0] rounded-xl text-sm text-[#333333] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-wider file:bg-[#1a3d2b] file:text-[#e8c84a] hover:file:bg-[#2a5a3b]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2.5 border border-[#d4c9b0] rounded-xl hover:bg-[#f5f0e8] transition-colors font-bold text-sm text-[#666666]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateProduce}
                    className="flex-1 px-4 py-2.5 bg-[#1a3d2b] text-[#e8c84a] rounded-xl hover:bg-[#2a5a3b] transition-colors font-bold text-sm"
                  >
                    Create Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}